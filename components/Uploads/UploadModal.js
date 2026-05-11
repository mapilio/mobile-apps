import {Modal, Pressable, View} from "react-native";
import {userUploadModalStyles} from "../../styles/userUploadStyle";
import {CustomText, CustomTextBold} from "../../highordercomponents";
import CircularProgress from "react-native-circular-progress-indicator";
import {RFValue} from "react-native-responsive-fontsize";
import Lottie from "lottie-react-native";
import {percentage} from "../../helper/upload";
import {CloseIcon} from "../../assets/svg/illustrations";
import React from "react";
import {useTranslation} from "react-i18next";
import FocusAwareStatusBar from "../FocusAwareStatusBar";

const UploadModal = ({visible, sequenceLength, totalImageCount, sentCount, totalSize, handleStop, togglePause, isPaused}) => {
  const {t} = useTranslation("upload_modal");

  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      <FocusAwareStatusBar barStyle="dark-content" translucent backgroundColor="#fff" />
      <View style={userUploadModalStyles.container}>
        <View style={userUploadModalStyles.header}>
          <CustomTextBold style={userUploadModalStyles.title}>
            {t("title")}
          </CustomTextBold>
          <CustomText style={userUploadModalStyles.subtitle}>
            {t("subtitle")}
          </CustomText>
        </View>
        <View style={userUploadModalStyles.sequenceInfo}>
          <CircularProgress
            initialValue={0}
            value={percentage(sentCount, totalImageCount)}
            rotation={270}
            valueSuffix={"%"}
            progressValueColor={'#191919'}
            activeStrokeColor={'#0056F1'}
            circleBackgroundColor={'#FFF'}
            progressValueFontSize={RFValue(20)}
            valueSuffixStyle={{fontSize: RFValue(10), transform: [{translateY: RFValue(-5)}]}}
          />
          <View style={userUploadModalStyles.sequenceInfoSide}>
            <View style={{alignItems: "center"}}>
              <CustomTextBold style={userUploadModalStyles.sequenceInfoTextBold}>{sequenceLength}</CustomTextBold>
              <CustomText style={userUploadModalStyles.sequenceInfoText}>
                {t("sequences")}
              </CustomText>
            </View>
            <View style={userUploadModalStyles.separator}/>
            <View style={{alignItems: "center"}}>
              <CustomTextBold style={userUploadModalStyles.sequenceInfoTextBold}>
                {totalImageCount - sentCount}
              </CustomTextBold>
              <CustomText style={userUploadModalStyles.sequenceInfoText}>
                {t("images")}
              </CustomText>
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
            <CustomTextBold style={{fontSize: RFValue(16), color:"#191919"}}>{totalImageCount} {t("images")}</CustomTextBold>
            <CustomText style={{fontSize: RFValue(16), color:"#191919"}}> / {totalSize > 0 ? `${totalSize}MB` : t("calculating")}</CustomText>
          </View>
        </View>
      </View>
      <View style={userUploadModalStyles.bottomBar}>
        <Pressable
          onPress={togglePause}
          style={[userUploadModalStyles.closeIcon, {backgroundColor: isPaused ? '#0056F1' : '#FFA500', marginRight: RFValue(12)}]}>
          <CustomText style={{color: '#FFF', fontSize: RFValue(12), fontFamily: 'Poppins-Medium'}}>
            {isPaused ? t("resume") : t("pause")}
          </CustomText>
        </Pressable>
        <CustomText style={userUploadModalStyles.close}>{t("stop_upload")}</CustomText>
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
