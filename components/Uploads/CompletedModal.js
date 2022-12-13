import {Modal, TouchableOpacity, View} from "react-native";
import React from "react";
import Lottie from "lottie-react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {UploadCompleted} from "../../assets/svg/illustrations";
import {CustomText, CustomTextBold} from "../../highordercomponents";

const completedModal = ({visible, onPressButton}) => {

  return (
    <Modal visible={visible} transparent={false} animationType={"slide"}>
      <View style={{
        alignItems: "center",
        marginBottom: "auto",
        marginHorizontal: RFValue(40),
      }}>
        <View style={{alignItems: "center"}}>
          <View style={{zIndex: 1}}>
            <Lottie
              source={require('../../assets/animations/completed.json')}
              style={{height: RFValue(375), paddingTop: RFValue(25)}}
              autoPlay={true}
              loop={true}
            />
          </View>
          <View style={{position: "absolute", bottom: RFValue(25), zIndex: 2}}>
            <UploadCompleted height={RFValue(75)} width={RFValue(75)}/>
          </View>
        </View>

        <View style={{alignItems: "center"}}>
          <CustomTextBold style={{fontSize: RFValue(14)}}>Upload Completed</CustomTextBold>
          <CustomText style={{textAlign: "center", marginTop: RFValue(10)}}>
            Your data is being processed... You will be notified by e-mail when your images are published on Mapilio.
          </CustomText>
        </View>
      </View>

        <TouchableOpacity
          onPress={onPressButton}
          style={{
            borderWidth: RFValue(1),
            borderColor: "#3F8BE9",
            borderRadius: RFValue(24),
            marginHorizontal: RFValue(40),
            alignItems: "center",
            marginBottom: RFValue(47),
            paddingVertical: RFValue(13),
            zIndex: 10,
          }}>
          <CustomText style={{
            color: "#3F8BE9",
            fontSize: RFValue(16)
          }}>Go To Map</CustomText>
        </TouchableOpacity>
    </Modal>
  )
}

export default completedModal;
