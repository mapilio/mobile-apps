import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { Path } from "react-native-svg";

const SwipeLine = ({ width = RFValue(55), height = RFValue(5) }) => (
  <Svg width={width} height={height} viewBox="0 0 55 5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M3 2.5H52" stroke="#B9C0CF" strokeWidth="5" strokeLinecap="round"/>
  </Svg>
);

export default SwipeLine;
