import React from "react";
import { Dimensions, Platform, View } from "react-native";
import { CustomText, CustomTextMedium } from "../highordercomponents";
import { globalStyles } from "../styles/globalStyles";
import { List } from "../components/Uploads";
import { userUploadStyles } from "../styles/userUploadStyle";
import { RFValue } from "react-native-responsive-fontsize";
import { useKeepAwake } from "expo-keep-awake";

const UserUpload = ({ navigation }) => {
  useKeepAwake();

  return (
    <View style={{ paddingBottom: RFValue(220) }}>
      <View style={userUploadStyles.container}>
        <CustomTextMedium style={globalStyles.screenTitle}>
          Upload Photos
        </CustomTextMedium>
        <CustomText style={globalStyles.screenDescription}>
          You can upload images from here.
        </CustomText>
      </View>
      <List navigation={navigation} />
    </View>
  );
};

export default UserUpload;
