import React from "react";
import {TouchableOpacity} from "react-native";
import {ArrowLeft} from "../../../assets/svg/illustrations";
import {CustomText} from "../../../highordercomponents";
import {sequenceLeft} from "../../../styles/navigatorBarStyles";
import {Routes} from "../../Routes";
import {useNavigation} from "@react-navigation/native";
import {useTranslation} from "react-i18next";

const ProfileSettingsNavigatorLeft = () => {
  const {t} = useTranslation("navigation");
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={sequenceLeft.container}
      onPress={() => {
        navigation.canGoBack() ? navigation.goBack() : navigation.navigate('ProfileTab', {screen: Routes.profile})
      }}
    >
      <ArrowLeft />
      <CustomText style={sequenceLeft.backTitle}>
        {t("back")}
      </CustomText>
    </TouchableOpacity>
  );
};

export default ProfileSettingsNavigatorLeft;
