import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { G, Path } from "react-native-svg";

const BadGPS = ({ width = RFValue(16), height = RFValue(14) }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 15.845 14"
  >
    <G transform="translate(-347.985 -319)">
      <G transform="translate(347.985 290.563)">
        <Path
          d="M15.7,40.881,8.821,28.956a1.038,1.038,0,0,0-1.8,0L.14,40.881a1.039,1.039,0,0,0,.9,1.557H14.806A1.039,1.039,0,0,0,15.7,40.881ZM7.932,32.628a.787.787,0,0,1,.785.808l-.13,4.529a.659.659,0,0,1-1.317,0l-.127-4.529A.789.789,0,0,1,7.932,32.628Zm-.01,8.191A.817.817,0,1,1,8.74,40,.818.818,0,0,1,7.922,40.819Z"
          transform="translate(0)"
          fill="#ffc231"
        />
      </G>
      <G transform="translate(347.985 290.563)">
        <Path
          d="M7.932,32.628a.787.787,0,0,1,.785.808l-.13,4.529a.659.659,0,0,1-1.317,0l-.127-4.529A.789.789,0,0,1,7.932,32.628Zm-.01,8.191A.817.817,0,1,1,8.74,40,.818.818,0,0,1,7.922,40.819Z"
          transform="translate(0)"
          fill="#fff"
        />
      </G>
    </G>
  </Svg>
);

export default BadGPS;
