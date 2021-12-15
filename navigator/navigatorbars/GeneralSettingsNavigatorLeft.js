import React from "react";
import { TouchableOpacity } from "react-native";
import { ArrowLeft } from "../../assets/svg/illustrations";
import { CustomText } from "../../highordercomponents";
import { generalSettingsLeft } from "../../styles/navigatorBarStyles";

const GeneralSettingsNavigatorLeft = (props) => {
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.7}
      style={generalSettingsLeft.container}
    >
      <ArrowLeft />
      <CustomText style={generalSettingsLeft.backTitle}>Back</CustomText>
    </TouchableOpacity>
  );
};

export default GeneralSettingsNavigatorLeft;
