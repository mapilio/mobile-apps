import React from "react";
import { View } from "react-native";
import { CustomText, CustomTextMedium } from "../highordercomponents";
import { globalStyles } from "../styles/globalStyles";
import { List } from "../components/Uploads";
import { userUploadStyles } from "../styles/userUploadStyle";
import { RFValue } from "react-native-responsive-fontsize";
import { useKeepAwake } from "expo-keep-awake";
import { useSelector } from "react-redux";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";
const UserUpload = ({ navigation }) => {
  const { uploadData } = useSelector((status) => status.uploadReducer);
  const { bottom } = useSafeAreaInsets();

  useKeepAwake();

  return (
    <View style={{ paddingBottom: bottom + RFValue(85) }}>
      <FocusAwareStatusBar barStyle="light-content" backgroundColor={"#130C47"} />
      {uploadData.length !== 0 && (
        <View style={userUploadStyles.container}>
          <CustomTextMedium style={globalStyles.screenTitle}>
            Upload Photos
          </CustomTextMedium>
          <CustomText style={globalStyles.screenDescription}>
            You can upload images from here.
          </CustomText>
        </View>
      )}
      <List navigation={navigation} />
    </View>
  );
};

export default UserUpload;
