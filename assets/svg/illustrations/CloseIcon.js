import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { Path } from "react-native-svg";

const CloseIcon = ({ width = RFValue(22), height = RFValue(22) }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 22.551 22.551"
  >
    <Path
      d="M6.874,15.085V8.6H.861a.861.861,0,1,1,0-1.722H6.874V.861A.861.861,0,1,1,8.6.861V6.874h6.489a.861.861,0,1,1,0,1.722H8.6v6.489a.861.861,0,0,1-1.722,0Z"
      transform="translate(11.275) rotate(45)"
      fill="#fff"
    />
  </Svg>
);

export default CloseIcon;
