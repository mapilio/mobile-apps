import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { G, Path } from "react-native-svg";

const CameraCenter = ({ width = RFValue(350), height = RFValue(83) }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 351.268 83"
  >
    <G
      id="Group_48337"
      data-name="Group 48337"
      transform="translate(-67.867 -157)"
    >
      <Path
        id="Union_143"
        data-name="Union 143"
        d="M13456-17444h2v9h9v2h-9v9h-2v-9h-9v-2h9Z"
        transform="translate(-13213.5 17632.5)"
        fill="#fff"
      />
      <Path
        id="Path_23005"
        data-name="Path 23005"
        d="M1.5,148.549h-3V0h3Z"
        transform="translate(216.416 198.5) rotate(90)"
        fill="#fff"
      />
      <Path
        id="Path_23006"
        data-name="Path 23006"
        d="M1.5,148.549h-3V0h3Z"
        transform="translate(419.135 198.5) rotate(90)"
        fill="#fff"
      />
      <Path
        id="Path_22993"
        data-name="Path 22993"
        d="M-13166.669,18137.8h-2v-21h21v2h-19Z"
        transform="translate(13370.668 -17959.801)"
        fill="#fff"
      />
      <Path
        id="Path_22995"
        data-name="Path 22995"
        d="M-13147.669,18138.8h-21v-21h2v19h19Z"
        transform="translate(13370.668 -17898.801)"
        fill="#fff"
      />
      <Path
        id="Path_22996"
        data-name="Path 22996"
        d="M-13146.669,18137.8h-2v-19h-19v-2h21Z"
        transform="translate(13431.338 -17959.801)"
        fill="#fff"
      />
      <Path
        id="Path_22997"
        data-name="Path 22997"
        d="M-13146.669,18138.8h-21v-2h19v-19h2Z"
        transform="translate(13431.338 -17898.801)"
        fill="#fff"
      />
    </G>
  </Svg>
);

export default CameraCenter;
