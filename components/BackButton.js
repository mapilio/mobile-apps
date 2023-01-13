import {ArrowLeft} from "../assets/svg/illustrations";
import {CustomText} from "../highordercomponents";
import {sequenceLeft} from "../styles/navigatorBarStyles";
import React from "react";
import {TouchableOpacity} from "react-native";
import {useTranslation} from "react-i18next";

const BackButton = (props) => {
  const {t} = useTranslation("navigation")

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={sequenceLeft.container}
      {...props}
    >
      <ArrowLeft/>
      <CustomText style={sequenceLeft.backTitle}>
        {t("back")}
      </CustomText>
    </TouchableOpacity>
  )
}

export default BackButton;
