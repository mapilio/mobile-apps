import React, {useEffect, useState} from "react";
import {View, TouchableOpacity} from "react-native";
import {UploadIcon} from "../../assets/svg/illustrations";
import {
  calculateToSequence,
  closeRequest,
  getHash,
  getImagesBySequence,
  imageryUpload,
} from "../../helper/upload";
import {activateKeepAwake, deactivateKeepAwake} from "expo-keep-awake";
import db from "../../db";
import {UPLOAD_DATA} from "../../store/actionsName";
import {Routes} from "../../navigator/Routes";
import {useDispatch, useSelector} from "react-redux";
import * as FileSystem from "expo-file-system";
import UploadModal from "./UploadModal";
import {useNavigation} from "@react-navigation/native";

const Upload = ({sequence_uuid}) => {
  const dispatch = useDispatch();
  const {uploadData} = useSelector((state) => state.uploadReducer);
  const {connection} = useSelector((state) => state.generalReducer);
  const {userInformation} = useSelector((state) => state.getTokenReducer);
  const [totalImageCount, setTotalImageCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [sequenceLength, setSequenceLength] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const navigation = useNavigation();
  const pictures = []

  useEffect(() => {
    let filePath = FileSystem.documentDirectory;
    sequence_uuid && (filePath += `/${sequence_uuid}`);

    FileSystem.getInfoAsync(filePath).then(({size}) => {
      setTotalSize(Math.round(size / 1024 / 1024))
    })

    return () => setTotalSize(0)
  }, []);

  const uploadHandler = () => {
    if (!connection.connectionStatus) {
      toast.show('You do not have an active internet connection', {type: 'error'});
      return;
    }

    if (!userInformation) {
      navigation.navigate(Routes.stackNavigator, {screen: Routes.login})
      return;
    }

    upload();
  }

  const upload = () => {
    activateKeepAwake('upload')

    calculateToSequence(sequence_uuid).then(({status, data}) => {
      if (status === 'success') {
        setTotalImageCount(data.count)
        getSequences(data.sequences)
        setModalVisible(true)
      }
    }).catch(() => {
      setModalVisible(false)
    }).finally(() => {
      deactivateKeepAwake('upload');
    })
  }

  const getSequences = (sequences, index = 0) => {
    setSequenceLength(sequences.length)
    if (sequences[index]) {
      getImagesBySequence(sequences[index]).then(images => {
        const uploadedCount = images.filter(item => item.uploaded === 1)
        setSentCount(prev => prev + uploadedCount.length)
        pictures.push(images)
      }).finally(() => getSequences(sequences, ++index))
    } else {
      sendImages(0, 0)
    }
  }

  const sendImages = (i = 0, j = 0) => {
    return new Promise(() => {
      if (pictures[i]) {
        if (pictures[i][j]) {
          if (pictures[i][j].hash) {
            pictures.hash = pictures[i][j].hash
            sendImages(i, ++j)
          } else {
            getHash(pictures[i][j]).then(async (res) => {
              if (res.status === 'success') {
                pictures.hash = res.hash;
                setSentCount(prev => prev + 1)
                await sendImages(i, ++j)
              } else {
                toast.show(res.message, {type: res.status})
              }
            }).catch(requestBroken)
          }
        } else {
          imageryUpload(i, pictures).then(async () => {
            navigation.navigate(Routes.upload);
            db.getGroupByWithSequenceUUID().then((data) => {
              dispatch({type: UPLOAD_DATA, payload: data})
            })
            await sendImages(++i)
          }).catch(requestBroken)
        }
      } else {
        setModalVisible(false)
        navigation.navigate("UploadTab", {screen: Routes.uploadCompleted})
      }
    })
  }

  const requestBroken = (error) => {
    closeRequest();
    setModalVisible(false);
    setSentCount(0);
    toast.show(`${error}`, {type: "error"})
  }

  const handleStop = () => {
    closeRequest();
    setModalVisible(false);
    setSentCount(0);
  }

  return (
    <View>
      {uploadData.length > 0 && <TouchableOpacity onPress={uploadHandler}><UploadIcon/></TouchableOpacity>}

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

export default Upload;
