import {Modal, Pressable, View} from "react-native";
import {userUploadModalStyles} from "../../styles/userUploadStyle";
import {CustomText, CustomTextBold} from "../../highordercomponents";
import CircularProgress from "react-native-circular-progress-indicator";
import {RFValue} from "react-native-responsive-fontsize";
import Lottie from "lottie-react-native";
import {percentage} from "../../helper/upload";
import {CloseIcon} from "../../assets/svg/illustrations";
import React from "react";

const UploadModal = ({visible, sequenceLength, totalImageCount, sentCount, totalSize, handleStop}) => {
  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      <View style={userUploadModalStyles.container}>
        <View style={userUploadModalStyles.header}>
          <CustomTextBold style={userUploadModalStyles.title}>
            Together We Create More Up-To-Date Maps
          </CustomTextBold>
          <CustomText style={userUploadModalStyles.subtitle}>
            You can shoot more and compete in the leaderboard to be the most contributing participant in your
            region.
          </CustomText>
        </View>
        <View style={userUploadModalStyles.sequenceInfo}>
          <CircularProgress
            initialValue={0}
            value={percentage(sentCount, totalImageCount)}
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
          onPress={handleStop}
          style={userUploadModalStyles.closeIcon}>
          <CloseIcon/>
        </Pressable>
      </View>
    </Modal>
  )
}

export default UploadModal;
