import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { Path, Rect } from "react-native-svg";

const BatteryLevel = ({ width = RFValue(36), height = RFValue(15) }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    data-name="Group 120117"
    viewBox="0 0 69.683 31.053"
  >
    <Path
      fill="#fff"
      d="M7.394 2.957a4.441 4.441 0 00-4.437 4.437v16.265A4.441 4.441 0 007.394 28.1h49.672a2.267 2.267 0 002.264-2.264V7.394a4.441 4.441 0 00-4.436-4.436h-47.5m0-2.958h47.5a7.394 7.394 0 017.394 7.394v18.437a5.222 5.222 0 01-5.222 5.222H7.394A7.394 7.394 0 010 23.659V7.394A7.394 7.394 0 017.394 0z"
      data-name="Rectangle 3"
    ></Path>
    <Path
      fill="#fff"
      d="M0 11.456V0a5.911 5.911 0 014.437 5.728A5.911 5.911 0 010 11.455z"
      data-name="Combined Shape"
      transform="translate(65.246 10.351)"
    ></Path>
    <Rect
      width="13.818"
      height="19.223"
      fill="#d33030"
      data-name="Rectangle Copy 4"
      rx="2"
      transform="translate(5.915 5.915)"
    ></Rect>
  </Svg>
);

export default BatteryLevel;
