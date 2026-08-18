import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { closeRequest, deleteSequence, getHash, imageryUpload, isWifi } from '../../helper/upload';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import db from '../../db';
import { UPLOAD_DATA } from '../../store/actionsName';
import { Routes } from '../../navigator/Routes';
import { useDispatch, useSelector } from 'react-redux';
import * as RNFS from '../../util/fs';
import UploadModal from './UploadModal';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { getUserInformation } from '../../store/reducers/loginReducer/getUserInformation';
import { captureException } from '@sentry/react-native';

const Upload = ({ group_uuid = null, style, buttonStyle }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('navigation');
  const { defaultStoragePath } = useSelector((state) => state.settingsReducer);
  const { uploadData } = useSelector((state) => state.uploadReducer);
  const { connection, maintenanceMode } = useSelector((state) => state.generalReducer);
  const { userInformation } = useSelector((state) => state.getTokenReducer);
  const [totalImageCount, setTotalImageCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [sequenceLength, setSequenceLength] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pauseRef = useRef(false);
  const navigation = useNavigation();

  let willDelete = [];

  const waitWhilePaused = () => {
    return new Promise((resolve) => {
      const check = () => {
        if (!pauseRef.current) return resolve();
        setTimeout(check, 500);
      };
      check();
    });
  };

  const togglePause = () => {
    pauseRef.current = !pauseRef.current;
    setIsPaused(pauseRef.current);
  };

  useEffect(() => {
    const loadSize = async () => {
      let path = RNFS.DocumentDirectoryPath;
      if (defaultStoragePath === 'external') {
        path = await RNFS.getRemovableExternalFilesDir();
        if (!path) return;
      }
      group_uuid && (path += `/${group_uuid}`);
      try {
        const { size } = await RNFS.stat(path);
        setTotalSize(Math.round(size / 1024 / 1024));
      } catch {}
    };
    loadSize();

    return () => setTotalSize(0);
  }, []);

  const uploadHandler = async () => {
    if (!connection.connectionStatus) {
      toast.show(t('have_not_connection'), { type: 'error' });
      return;
    }

    if (!userInformation) {
      navigation.navigate(Routes.stackNavigator, { screen: Routes.login });
      return;
    }

    const { status } = await isWifi();

    if (status !== 'success') {
      return;
    }

    await activateKeepAwakeAsync('upload');
    setModalVisible(true);

    const { sequences, total } = await db.getSequencesForUpload(group_uuid);
    setTotalImageCount(total);
    setSequenceLength(sequences.length);

    sequence: for (let [index, sequence] of sequences.entries()) {
      try {
        const isCaptureIDNull = await db.isCaptureIdNull(sequence.sequence_uuid);
        const orderBy = isCaptureIDNull ? 'id ASC' : 'capture_id ASC';
        const images = await db.getCapturesBySequenceIdAsync(
          sequence.sequence_uuid,
          orderBy,
          group_uuid
        );

        for (let image of images) {
          await waitWhilePaused();
          const { status, hash, message } = await getHash(image);

          if (status === 'success') {
            image.hash = hash;
            setSentCount((prev) => prev + 1);
          } else {
            toast.show(message, { type: 'error' });
            break sequence;
          }
        }

        await waitWhilePaused();
        const { status, message } = await imageryUpload(images, sequence.sequence_uuid, group_uuid);

        if (status === 'success') {
          willDelete.push(sequence.sequence_uuid);

          if (index === sequences.length - 1) {
            navigation.navigate('UploadTab', { screen: Routes.uploadCompleted });
          }
        } else {
          toast.show(message, { type: 'error' });
          break;
        }
      } catch (e) {
        captureException(e, {
          tags: {
            functionName: 'uploadHandler',
          },
        });
        toast.show(e.message, { type: 'error' });
        break;
      }
    }

    for (let uuid of willDelete) {
      await deleteSequence(uuid, group_uuid);
      willDelete = willDelete.filter((item) => item !== uuid);
    }

    db.getGroupByWithGroupID().then((data) => dispatch({ type: UPLOAD_DATA, payload: data }));

    handleStop();
    dispatch(getUserInformation());
    deactivateKeepAwake('upload');
  };

  const handleStop = () => {
    pauseRef.current = false;
    setIsPaused(false);
    closeRequest();
    setModalVisible(false);
    setTotalImageCount(0);
    setSentCount(0);
  };

  return (
    <View style={style}>
      {(!!uploadData.length || group_uuid) && (
        <TouchableOpacity
          style={{
            ...styles.uploadButton,
            ...buttonStyle,
            backgroundColor: maintenanceMode ? '#ECECEC' : '#0056F1',
          }}
          onPress={uploadHandler}
          disabled={maintenanceMode}
          accessibilityRole="button"
          accessibilityLabel={t('start_upload', { ns: 'upload' })}
          accessibilityState={{ disabled: maintenanceMode }}>
          <Text style={{ ...styles.uploadButtonText, color: maintenanceMode ? '#C2C2C2' : '#fff' }}>
            {t('start_upload', { ns: 'upload' })}
          </Text>
        </TouchableOpacity>
      )}

      <UploadModal
        visible={modalVisible}
        sentCount={sentCount}
        sequenceLength={sequenceLength}
        totalImageCount={totalImageCount}
        handleStop={handleStop}
        togglePause={togglePause}
        isPaused={isPaused}
        totalSize={totalSize}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  uploadButton: {
    padding: RFValue(15),
    margin: RFValue(15),
    marginBottom: RFValue(25),
    borderRadius: RFPercentage(50),
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: RFValue(14),
    fontFamily: 'Poppins-Medium',
  },
});

export default Upload;
