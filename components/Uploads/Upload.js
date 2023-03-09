import React, {useEffect, useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {closeRequest, filesFilter, getHash, getImagesBySequence, imageryUpload, isWifi} from "../../helper/upload";
import {activateKeepAwake, deactivateKeepAwake} from "expo-keep-awake";
import db from "../../db";
import {UPLOAD_DATA} from "../../store/actionsName";
import {Routes} from "../../navigator/Routes";
import {useDispatch, useSelector} from "react-redux";
import * as FileSystem from "expo-file-system";
import UploadModal from "./UploadModal";
import {useNavigation} from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";
import {getUserInformation} from "../../store/reducers/loginReducer/getUserInformation";

const Upload = ({group_uuid = null, style, buttonStyle}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation("navigation");
  const {uploadData} = useSelector((state) => state.uploadReducer);
  const {connection} = useSelector((state) => state.generalReducer);
  const { userInformation} = useSelector((state) => state.getTokenReducer);
  const [totalImageCount, setTotalImageCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [sequenceLength, setSequenceLength] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const navigation = useNavigation();
  const pictures = []

  useEffect(() => {
    let path = FileSystem.documentDirectory;
    group_uuid && (path += `/${group_uuid}`);

    FileSystem.getInfoAsync(path).then(({size}) => {
      setTotalSize(Math.round(size / 1024 / 1024))
    })

    return () => setTotalSize(0)
  }, []);

  const uploadHandler = async () => {
    setTotalImageCount(0)
    setSentCount(0)

    if (!connection.connectionStatus) {
      toast.show(t("have_not_connection"), {type: 'error'});
      return;
    }

    if (!userInformation) {
      navigation.navigate(Routes.stackNavigator, {screen: Routes.login})
      return;
    }
    activateKeepAwake('upload');
    setModalVisible(true)

    await isWifi();
    const files = await filesFilter(group_uuid);

    setSequenceLength(files.length)

    files.forEach(item => {
      setTotalImageCount(prev => prev + item.count)
    })

    await getSequences(files)
  }

  const getSequences = async (sequences, index = 0) => {
    if (sequences[index]) {
      getImagesBySequence(sequences[index].sequence_uuid).then(images => {
        const uploadedCount = images.filter(item => item.uploaded === 1)
        setSentCount(prev => prev + uploadedCount.length)
        pictures.push(images)
      }).finally(() => getSequences(sequences, ++index))
    } else {
      await sendImages(0, 0)
    }
  }

  const sendImages = async (i = 0, j = 0) => {
    return new Promise(async () => {
      if (pictures[i]) {
        if (pictures[i][j]) {
          if (pictures[i][j].hash) {
            pictures.hash = pictures[i][j].hash
            await sendImages(i, ++j)
          } else {
            try {
              const hash = await getHash(pictures[i][j])

              if (hash.status === 'success') {
                pictures.hash = hash.hash;
                setSentCount(prev => prev + 1)
                await sendImages(i, ++j)
              } else {
                requestBroken(hash.message)
                toast.show(hash.message, {type: hash.status})
              }
            } catch (err) {
              requestBroken(err)
            }
          }
        } else {
          imageryUpload(i, pictures).then(async () => {
            navigation.navigate(Routes.upload);
            db.getGroupByWithGroupID().then((data) => {
              dispatch({type: UPLOAD_DATA, payload: data})
            })
            await sendImages(++i)
          }).catch((err) => {
            requestBroken(err)
          })
        }
      } else {
        setModalVisible(false)
        dispatch(getUserInformation())
        navigation.navigate("UploadTab", {screen: Routes.uploadCompleted})
      }
    })
  }

  const requestBroken = (error) => {
    closeRequest();
    setModalVisible(false);
    deactivateKeepAwake('upload');
    setSentCount(0);
    if(error.message === "CanceledError: canceled"){
      toast.show(t("you_cancelled_upload", {
        ns:"upload"
      }), {type: "error"})
    }else{
    toast.show(`${error}`, {type: "error"})}
  }

  const handleStop = () => {
    closeRequest();
    setModalVisible(false);
    setSentCount(0);
  }

  return (
    <View style={style}>
      {(!!uploadData.length || group_uuid) && (
        <TouchableOpacity
          style={{...styles.uploadButton, ...buttonStyle}}
          onPress={uploadHandler}
        >
          <Text style={styles.uploadButtonText}>{t("start_upload", {ns: 'upload'})}</Text>
        </TouchableOpacity>
      )}

      <UploadModal
        visible={modalVisible}
        sentCount={sentCount}
        sequenceLength={sequenceLength}
        totalImageCount={totalImageCount}
        handleStop={handleStop}
        totalSize={totalSize}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  uploadButton: {
    backgroundColor: '#0056F1',
    padding: RFValue(15),
    margin: RFValue(15),
    marginBottom: RFValue(25),
    borderRadius: RFPercentage(50),
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#FFF',
    fontSize: RFValue(14),
    fontFamily: 'Poppins-Medium',
  },
})

export default Upload;
