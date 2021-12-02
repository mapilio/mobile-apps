import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { Rect } from "react-native-svg";

const Stop = ({ width = RFValue(18), height = RFValue(18) }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 18 18"
  >
    <Rect
      id="Rectangle_17514"
      data-name="Rectangle 17514"
      width="18"
      height="18"
      rx="4"
      fill="#e24a4a"
    />
  </Svg>
);

export default Stop;
