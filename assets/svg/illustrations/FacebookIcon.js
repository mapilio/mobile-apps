import React from "react";
import { Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { Path } from "react-native-svg";

const FacebookIcon = ({
  width = Platform.OS === "android" ? RFValue(20) : RFValue(11),
  height = Platform.OS === "android" ? RFValue(20) : RFValue(11),
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 11 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M10.442 7.632H6.61502V4.839C6.61502 3.983 7.50101 3.784 7.91501 3.784H10.387V0.0149994L7.55301 0C3.68801 0 2.80501 2.81 2.80501 4.612V7.632H0.00500488V11.516H2.80501V22H6.61502V11.516H9.85101L10.442 7.632Z"
      fill="white"
    />
  </Svg>
);

export default FacebookIcon;
