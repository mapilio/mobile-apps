import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { Path, Rect } from "react-native-svg";

const BatteryLevel = ({ width = RFValue(36), height = RFValue(15) }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 35.758 15.325"
  >
    <Path
      d="M3.649,1.459A2.192,2.192,0,0,0,1.459,3.649v8.027a2.192,2.192,0,0,0,2.189,2.189H29.532a1.119,1.119,0,0,0,1.117-1.117v-9.1A2.192,2.192,0,0,0,28.46,1.459H3.649M3.649,0H28.46a3.649,3.649,0,0,1,3.649,3.649v9.1a2.577,2.577,0,0,1-2.577,2.577H3.649A3.649,3.649,0,0,1,0,11.676V3.649A3.649,3.649,0,0,1,3.649,0Z"
      fill="#fff"
      opacity="0.4"
    />
    <Path
      d="M0,5.653V0A2.917,2.917,0,0,1,2.19,2.827,2.917,2.917,0,0,1,0,5.653Z"
      transform="translate(33.568 5.108)"
      fill="rgba(255,255,255,0.4)"
    />
    <Rect
      width="4.352"
      height="9.487"
      rx="1"
      transform="translate(2.919 2.919)"
      fill="#d33030"
    />
  </Svg>
);

export default BatteryLevel;
