import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { Path } from "react-native-svg";

const ArrowLeft = ({width = RFValue(8.5), height = RFValue(15), color = '#808080',}) => (
  <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 8.5 15"
    >
      <Path
        fill={color}
        fillRule="evenodd"
        d="M35.707 37.793a1 1 0 010 1.414L29.914 45l5.793 5.793a1 1 0 01-1.414 1.414l-6.5-6.5a1 1 0 010-1.414l6.5-6.5a1 1 0 011.414 0z"
        data-name="Path 90819"
        transform="translate(-27.5 -37.5)"
      ></Path>
    </Svg>
);

export default ArrowLeft;
