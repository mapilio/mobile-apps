import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { Path } from "react-native-svg";

const ArrowLeft = ({width = RFValue(11.5), height = RFValue(11.5), color = '#b9c0cf'}) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 11.575 11.575">
    <Path
      id="union"
      d="M0,7.483V.756A.7.7,0,0,1,.233.233.7.7,0,0,1,.756,0H7.483a.7.7,0,1,1,0,1.4H1.4v6.08a.7.7,0,1,1-1.4,0Z"
      transform="translate(0 5.787) rotate(-45)"
      fill={color}
    />
  </Svg>
);

export default ArrowLeft;
