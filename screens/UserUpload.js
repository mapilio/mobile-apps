import React, { Fragment, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import { AlertModal, EmptyList, UploadItem } from '../components';
import { UPLOAD_DATA } from '../store/actionsName';
import { Upload } from '../components/Uploads';
import db from '../db';
import { LinearGradient } from 'expo-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import InfoBox from '../components/InfoBox/InfoBox';
import { useNavigation } from '@react-navigation/native';
import * as RNFS from '../util/fs';

const UserUpload = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { uploadData } = useSelector((status) => status.uploadReducer);
  const { mapShown, maintenanceMode } = useSelector((status) => status.generalReducer);
  const [deleteItem, setDeleteItem] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(['upload', 'alerts']);

  useEffect(() => {
    navigation.addListener('focus', () => {
      getData();
    });
    return () => {
      navigation.removeListener('focus');
    };
  }, []);

  const getData = () => {
    db.getGroupByWithGroupID().then((data) => {
      if (Platform.OS === 'android') {
        RNFS.getRemovableExternalFilesDir().then((sdCardPath) => {
          if (!sdCardPath) {
            const filtered = data.filter((item) => item.default_storage_path === 'internal');
            dispatch({ type: UPLOAD_DATA, payload: filtered });
          } else {
            dispatch({ type: UPLOAD_DATA, payload: data });
          }
        });
      } else {
        dispatch({ type: UPLOAD_DATA, payload: data });
      }
    });
  };

  const resetToDefault = () => {
    getData();
    setDeleteItem(undefined);
    setLoading(false);
  };

  const deleteSequence = async () => {
    if (!deleteItem) return;
    setLoading(true);
    try {
      let path = RNFS.DocumentDirectoryPath;
      if (deleteItem.default_storage_path === 'external') {
        path = await RNFS.getRemovableExternalFilesDir();
        if (!path) return;
      }
      const groupPath = `${path}/${deleteItem.group_id}`;
      if (await RNFS.exists(groupPath)) await RNFS.unlink(groupPath);
      await db.deleteByGroupID(deleteItem.group_id);
    } catch {
      // Keep metadata when filesystem cleanup fails.
    } finally {
      resetToDefault();
    }
  };

  return (
    <Fragment>
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      {maintenanceMode && uploadData.length > 0 && (
        <InfoBox type={'warning'} content={t('alerts:maintenanceMode')} />
      )}
      <View style={styles.listContainer}>
        <FlatList
          scrollEnabled={uploadData.length > 0}
          data={uploadData}
          ListEmptyComponent={<EmptyList />}
          renderItem={({ item }) =>
            mapShown ? <UploadItem item={item} deleteFunc={setDeleteItem} /> : null
          }
          keyExtractor={(item) => item.sequence_uuid}
          ListFooterComponent={<View />}
          ListFooterComponentStyle={{ paddingBottom: RFValue(100) }}
        />
        {uploadData.length > 0 && (
          <LinearGradient
            style={styles.gradient}
            colors={['white', 'rgba(255,255,255,0)']}
            pointerEvents="none"
            locations={[0.95, 0.75]}
          />
        )}
      </View>

      <Upload style={styles.upload} />

      <AlertModal
        visible={!!deleteItem}
        title={t('upload:delete_capture')}
        description={t('upload:delete_message')}
        loading={loading}
        buttons={{
          cancel: { text: t('upload:no'), onPress: () => setDeleteItem(undefined) },
          confirm: { text: t('upload:yes'), onPress: deleteSequence },
        }}
      />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    width: '100%',
  },
  upload: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'transparent',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default UserUpload;
