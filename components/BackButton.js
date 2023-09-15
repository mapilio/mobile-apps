import {ArrowLeft} from "../assets/svg/illustrations";
import {CustomText} from "../highordercomponents";
import {sequenceLeft} from "../styles/navigatorBarStyles";
import React from "react";
import {TouchableOpacity} from "react-native";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";

const BackButton = ({title}) => {
  const {t} = useTranslation("navigation")
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={sequenceLeft.container}
      onPress={() => navigation.goBack()}
    >
      <ArrowLeft width={RFValue(7)} height={RFValue(12)} />
      <CustomText style={sequenceLeft.backTitle}>
        {t(title || "back")}
      </CustomText>
    </TouchableOpacity>
  )
}

export default BackButton;
