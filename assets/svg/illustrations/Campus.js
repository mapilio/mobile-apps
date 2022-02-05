import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from "react-native-svg";

const Campus = ({ width = RFValue(33), height = RFValue(33) }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={width}
    height={height}
    viewBox="0 0 33 33"
  >
    <Defs>
      <ClipPath id="a">
        <Rect width={width} height={height} fill="none" />
      </ClipPath>
    </Defs>
    <G transform="translate(-1.945 -0.209)">
      <G transform="translate(1.945 0.209)" clip-path="url(#a)">
        <G transform="translate(-1.945 -0.209)">
          <G
            transform="translate(1.945 0.209)"
            fill="#1f304c"
            stroke="#dadee3"
            stroke-width="0.5"
            opacity="0.75"
          >
            <Circle cx="16.5" cy="16.5" r="16.5" stroke="none" />
            <Circle cx="16.5" cy="16.5" r="16.25" fill="none" />
          </G>
        </G>
      </G>
      <Path
        d="M0,2.113a11.745,11.745,0,0,1,13.441,0L6.72,14.53Z"
        transform="translate(11.583 2.098)"
        fill="#fff"
        opacity="0.77"
      />
    </G>
  </Svg>
);

export default Campus;
