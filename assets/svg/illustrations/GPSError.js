import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { G, Path } from "react-native-svg";

const GPSError = ({ width = RFValue(34), height = RFValue(30) }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 33.35 29.467"
  >
    <G transform="translate(-347.985 -314.734)">
      <G transform="translate(347.985 314.734)">
        <Path
          d="M33.055,54.628l-14.489-25.1a2.185,2.185,0,0,0-3.783,0L.295,54.628A2.186,2.186,0,0,0,2.186,57.9H31.163A2.186,2.186,0,0,0,33.055,54.628ZM16.7,37.258a1.656,1.656,0,0,1,1.652,1.7l-.273,9.532a1.387,1.387,0,0,1-2.772,0l-.266-9.532A1.661,1.661,0,0,1,16.7,37.258Zm-.02,17.24A1.721,1.721,0,1,1,18.4,52.777,1.722,1.722,0,0,1,16.675,54.5Z"
          transform="translate(0 -28.438)"
          fill="#ffc231"
        />
      </G>
    </G>
  </Svg>
);

export default GPSError;
