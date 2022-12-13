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
import CompletedModal from "./CompletedModal";
import UploadModal from "./UploadModal";

const Upload = ({sequence_uuid, navigation}) => {
  const dispatch = useDispatch();
  const { uploadData } = useSelector((state) => state.uploadReducer);
  const {userInformation} = useSelector((state) => state.getTokenReducer);
  const [totalImageCount, setTotalImageCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [completedModalVisible, setCompletedModalVisible] = useState(false);
  const [sequenceLength, setSequenceLength] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const pictures = []

  useEffect(() => {
    let filePath = FileSystem.documentDirectory + `${userInformation.id}`;
    sequence_uuid && (filePath += `/${sequence_uuid}`);

    FileSystem.getInfoAsync(filePath).then(({size}) => {
      setTotalSize(Math.round(size / 1024 / 1024))
    })

    return () => setTotalSize(0)
  }, []);

  const upload = () => {
    activateKeepAwake('upload')
    setModalVisible(true)

    calculateToSequence(sequence_uuid).then(({status, data}) => {
      if (status === 'success') {
        setTotalImageCount(data.count)
        getSequences(data.sequences)
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
            db.getGroupByWithColumn((_, result) => {
              dispatch({type: UPLOAD_DATA, payload: result.rows._array})
            })
            await sendImages(++i)
          }).catch(requestBroken)
        }
      } else {
        setCompletedModalVisible(true)
        setModalVisible(false)
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
      {uploadData.length > 0 && <TouchableOpacity onPress={upload}><UploadIcon/></TouchableOpacity>}

      <UploadModal
        visible={modalVisible}
        sentCount={sentCount}
        sequenceLength={sequenceLength}
        totalImageCount={totalImageCount}
        handleStop={handleStop}
        totalSize={totalSize}
      />

      <CompletedModal
        navigation={navigation}
        visible={completedModalVisible}
        onPressButton={() => {
          setCompletedModalVisible(false)
          navigation.navigate(Routes.map)
        }}
      />
    </View>
  );
};

export default Upload;
