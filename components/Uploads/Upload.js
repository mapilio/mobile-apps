import React, {useEffect, useState} from "react";
import {View, TouchableOpacity, Modal, Pressable} from "react-native";
import {CloseIcon, UploadIcon} from "../../assets/svg/illustrations";
import {
  calculateToSequence,
  closeRequest,
  getHash,
  getImagesBySequence,
  imageryUpload,
  percentage
} from "../../helper/upload";
import {activateKeepAwake, deactivateKeepAwake} from "expo-keep-awake";
import db from "../../db";
import {UPLOAD_DATA} from "../../store/actionsName";
import {Routes} from "../../navigator/Routes";
import {useDispatch, useSelector} from "react-redux";
import {userUploadModalStyles} from "../../styles/userUploadStyle";
import {CustomText, CustomTextBold} from "../../highordercomponents";
import CircularProgress from "react-native-circular-progress-indicator";
import {RFValue} from "react-native-responsive-fontsize";
import Lottie from 'lottie-react-native';
import * as FileSystem from "expo-file-system";

const Upload = ({sequence_uuid, navigation}) => {
  const dispatch = useDispatch();
  const {userInformation} = useSelector((state) => state.getTokenReducer);
  const [totalImageCount, setTotalImageCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [sequenceLength, setSequenceLength] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [percentageValue, setPercentageValue] = useState(0);
  const pictures = []

  useEffect(() => {
    let filePath = FileSystem.documentDirectory + `${userInformation.id}`;
    sequence_uuid && (filePath += `/${sequence_uuid}`);

    FileSystem.getInfoAsync(filePath).then(({size}) => {
      setTotalSize(Math.round(size / 1024 / 1024))
    })

    return () => setTotalSize(0)
  }, []);

  useEffect(() => {
    setPercentageValue(percentage(sentCount, totalImageCount))
  }, [sentCount]);


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
            getHash(pictures[i][j]).then(async ({hash}) => {
              pictures.hash = hash;
              setSentCount(prev => prev + 1)
              await sendImages(i, ++j)
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
        setModalVisible(false)
        toast.show("Upload is successfully", {type: "success"})
      }
    })
  }

  const requestBroken = (error) => {
    closeRequest();
    setModalVisible(false);
    setSentCount(0);
    toast.show(`${error}`, {type: "error"})
  }

  return (
    <View>
      <TouchableOpacity onPress={upload}>
        <UploadIcon/>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View style={userUploadModalStyles.container}>
          <View style={userUploadModalStyles.header}>
            <CustomTextBold style={userUploadModalStyles.title}>
              Together We Create More Up-To-Date Maps
            </CustomTextBold>
            <CustomText style={userUploadModalStyles.subtitle}>
              You can shoot more and compete in the leaderboard to be the most contributing participant in your region.
            </CustomText>
          </View>
          <View style={userUploadModalStyles.sequenceInfo}>
            <CircularProgress
              initialValue={0}
              value={percentageValue}
              rotation={270}
              valueSuffix={"%"}
              progressValueColor={'#000'}
              activeStrokeColor={'#3F8BE9'}
              circleBackgroundColor={'#FFF'}
              progressValueFontSize={RFValue(20)}
              valueSuffixStyle={{fontSize: RFValue(10), transform: [{translateY: RFValue(-5)}]}}
            />
            <View style={userUploadModalStyles.sequenceInfoSide}>
              <View style={{alignItems: "center"}}>
                <CustomTextBold style={userUploadModalStyles.sequenceInfoTextBold}>{sequenceLength}</CustomTextBold>
                <CustomText style={userUploadModalStyles.sequenceInfoText}>Sequences</CustomText>
              </View>
              <View style={userUploadModalStyles.separator}/>
              <View style={{alignItems: "center"}}>
                <CustomTextBold style={userUploadModalStyles.sequenceInfoTextBold}>
                  {totalImageCount - sentCount}
                </CustomTextBold>
                <CustomText style={userUploadModalStyles.sequenceInfoText}>Images</CustomText>
              </View>
            </View>
          </View>

          <View style={{flexDirection: "row", alignItems: "center", marginTop: RFValue(35)}}>
            <Lottie
              source={require('../../assets/animations/upload.json')}
              style={{width: RFValue(30), height: RFValue(30)}}
              autoPlay={true}
              loop={true}
            />

            <View style={{flexDirection: "row", alignItems: "center", marginLeft: RFValue(10)}}>
              <CustomTextBold style={{fontSize: RFValue(16)}}>{totalImageCount} images</CustomTextBold>
              <CustomText style={{fontSize: RFValue(16)}}> / {totalSize}MB</CustomText>
            </View>
          </View>
        </View>

        <View style={userUploadModalStyles.bottomBar}>
          <CustomText style={userUploadModalStyles.close}>Stop Uploading</CustomText>
          <Pressable
            onPress={() => {
              if (sentCount <= totalImageCount - 1) {
                closeRequest();
                setModalVisible(false);
                setSentCount(0);
              }
            }}
            style={userUploadModalStyles.closeIcon}>
            <CloseIcon/>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

export default Upload;
