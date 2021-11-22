import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { G, Path, Circle } from "react-native-svg";

const UploadIcon = ({ width = RFValue(36), height = RFValue(36) }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={width}
    height={height}
    viewBox="0 0 48 48"
  >
    <Circle cx="24" cy="22" r="20" fill="#1AD971" />
    <G
      id="Group_47450"
      data-name="Group 47450"
      transform="translate(-288.187 -523.622)"
    >
      <G
        id="Group_47447"
        data-name="Group 47447"
        transform="translate(294.569 528.005)"
      >
        <G
          transform="matrix(1, 0, 0, 1, -6.38, -4.38)"
          filter="url(#Ellipse_445)"
        >
          <Circle
            id="Ellipse_445-2"
            data-name="Ellipse 445"
            cx="18"
            cy="18"
            r="18"
            transform="translate(6 4)"
            fill="#1ad971"
          />
        </G>
      </G>
      <Path
        id="Path_22991"
        data-name="Path 22991"
        d="M11.446,14.495C9.68,13.025,8.781,10.42,8.771,6.746l-2.3,3.423a.638.638,0,1,1-1.059-.71L8.912,4.247a.638.638,0,0,1,1.082,0l3.495,5.212a.638.638,0,1,1-1.059.71L10.047,6.616c-.011,3.345.733,5.665,2.215,6.9a4.31,4.31,0,0,0,3.373.906.638.638,0,1,1,.266,1.248,4.617,4.617,0,0,1-.909.079A5.507,5.507,0,0,1,11.446,14.495Zm5-3.956V3.269A1.874,1.874,0,0,0,16.1,2.138l-.022-.023a2.138,2.138,0,0,0-1.629-.839H3.269A2,2,0,0,0,1.276,3.269v7.269a.638.638,0,0,1-1.276,0V3.269A3.273,3.273,0,0,1,3.269,0H14.453a3.364,3.364,0,0,1,2.569,1.251,3.071,3.071,0,0,1,.7,2.018v7.269a.638.638,0,0,1-1.276,0Z"
        transform="translate(303.265 538.135)"
        fill="#fff"
      />
    </G>
  </Svg>
);

export default UploadIcon;
