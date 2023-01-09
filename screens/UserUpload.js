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
import {useTranslation} from "react-i18next";
const UserUpload = ({ navigation }) => {
  const { uploadData } = useSelector((status) => status.uploadReducer);
  const {t} = useTranslation("upload");
  const { bottom } = useSafeAreaInsets();

  useKeepAwake();

  return (
    <View style={{ paddingBottom: bottom + RFValue(85) }}>
      <FocusAwareStatusBar barStyle="light-content" backgroundColor={"#130C47"} />
      {uploadData.length !== 0 && (
        <View style={userUploadStyles.container}>
          <CustomTextMedium style={globalStyles.screenTitle}>
            {t("title")}
          </CustomTextMedium>
          <CustomText style={globalStyles.screenDescription}>
            {t("subtitle")}
          </CustomText>
        </View>
      )}
      <List navigation={navigation} />
    </View>
  );
};

export default UserUpload;
