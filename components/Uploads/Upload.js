import React, {useState} from "react";
import {View, TouchableOpacity, Modal, ActivityIndicator} from "react-native";
import {CloseIcon, UploadIcon} from "../../assets/svg/illustrations";
import {calculateToSequence, getHash, getImagesBySequence, imageryUpload, percentage} from "../../helper/upload";
import {activateKeepAwake, deactivateKeepAwake} from "expo-keep-awake";
import {toastMessage} from "../../helper/alerts";
import db from "../../db";
import {UPLOAD_DATA} from "../../store/actionsName";
import {Routes} from "../../navigator/Routes";
import {useDispatch} from "react-redux";
import {userUploadModalStyles} from "../../styles/userUploadStyle";
import {CustomText} from "../../highordercomponents";
import * as Progress from "react-native-progress";
import {RFValue} from "react-native-responsive-fontsize";

const Upload = ({sequence_uuid, navigation}) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState('Calculating...');
  const [totalImageCount, setTotalImageCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const pictures = []

  const upload = () => {
    setModalVisible(true)
    setStatus('Checking your files... 🔎')
    activateKeepAwake();

    calculateToSequence(sequence_uuid).then(({status, data}) => {
      if (status === 'success') {
        setTotalImageCount(data.count)
        getSequences(data.sequences)
      }
    }).finally(() => {
      setStatus('Checking your files... 🔎')
      deactivateKeepAwake()
    })
  }

  const getSequences = (sequences, index = 0) => {
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

  const sendImages= (i = 0, j = 0) => {
    return new Promise(() => {
      setStatus('Sending your pictures... 📨')
      if (pictures[i]) {
        if (pictures[i][j]) {
          if (pictures[i][j].hash) {
            sendImages(i, ++j)
          } else {
            getHash(pictures[i][j]).then(async ({hash}) => {
              pictures.hash = hash;
              setSentCount(prev => prev + 1)
              await sendImages(i, ++j)
            })
          }
        } else {
          imageryUpload(i, pictures).then(async () => {
            navigation.navigate(Routes.upload);
            db.getGroupByWithColumn((_, result) => {dispatch({type: UPLOAD_DATA, payload: result.rows._array})})
            await sendImages(++i)
          })
        }
      } else {
        setModalVisible(false)
        toastMessage.success('Upload is successfully 🥰')
      }
    })
  }

  return (
    <View>
      <TouchableOpacity onPress={upload}>
        <UploadIcon />
      </TouchableOpacity>

      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View style={userUploadModalStyles.container}>
          <TouchableOpacity
            style={userUploadModalStyles.close}
            onPress={() => {
              setModalVisible(false);
              setSentCount(0);
            }}
          >
            <CloseIcon/>
          </TouchableOpacity>
          <View style={{alignItems: "center"}}>
            <View style={{flexDirection: 'row'}}>
              <ActivityIndicator color={"#FFFFFF"} style={{marginRight: RFValue(5)}}/>
              <CustomText style={userUploadModalStyles.text}>
                {status}
              </CustomText>
            </View>

            <CustomText style={userUploadModalStyles.text}>
              {sentCount} out of {totalImageCount} images have been uploaded
            </CustomText>

            <Progress.Bar progress={percentage(sentCount, totalImageCount)} width={200}/>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Upload;
