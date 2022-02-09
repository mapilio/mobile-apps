import * as React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { Defs, G, Path, Circle } from "react-native-svg";

const Orientation = ({ width = RFValue(207), height = RFValue(28) }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 207.79 28.061"
  >
    <Defs></Defs>
    <G transform="translate(-127.145 -132.181)">
      <G transform="translate(127.15 132.18)" filter="url(#a)">
        <Path
          d="M4 14.03h199.79"
          fill="none"
          stroke="#cbd1d9"
          strokeLinecap="round"
          strokeWidth={2}
        />
      </G>
      <Path
        d="m148.324 159.096 165.434-25.769"
        fill="none"
        stroke="#d91a1a"
        strokeLinecap="round"
        strokeWidth={2}
      />
      <Path
        d="M153.681 146.21H308.4"
        fill="none"
        stroke="#1ad971"
        strokeLinecap="round"
        strokeWidth={4}
      />
      <Circle
        cx={4.5}
        cy={4.5}
        r={4.5}
        transform="translate(226.397 141.709)"
        fill="#cbd1d9"
      />
    </G>
  </Svg>
);

export default Orientation;
