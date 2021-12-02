import React from "react";
import { TouchableOpacity } from "react-native";
import { ArrowLeft } from "../../assets/svg/illustrations";
import { CustomText } from "../../highordercomponents";
import { sequenceLeft } from "../../styles/navigatorBarStyles";

const SequenceNavigatorLeft = (props) => (
  <TouchableOpacity
    {...props}
    activeOpacity={0.7}
    style={sequenceLeft.container}
  >
    <ArrowLeft />
    <CustomText style={sequenceLeft.backTitle}>Back</CustomText>
  </TouchableOpacity>
);

export default SequenceNavigatorLeft;
