import React from "react";
import {RFValue} from "react-native-responsive-fontsize";
import Svg, {G, Path, Rect} from "react-native-svg";

const Marketplace = ({ width = RFValue(24), height = RFValue(24), color = "#0bbf5d" }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 23"
  >
    <G transform="translate(0.414 0.258)">
      <G transform="translate(0 0.183)">
        <Rect
          width="24"
          height="23"
          transform="translate(-0.414 -0.441)"
          fill={color}
          opacity="0"
        />
        <Path
          d="M20.407,4.538H16.886V8.676a1.761,1.761,0,0,0,3.521,0ZM0,2.5A2.5,2.5,0,0,1,2.5,0H19.267a2.506,2.506,0,0,1,2.5,2.5V8.676a3.121,3.121,0,0,1-5.625,1.864,3.336,3.336,0,0,1-2.6,1.259h0a3.409,3.409,0,0,1-2.658-1.328A3.352,3.352,0,0,1,8.228,11.8h0a3.338,3.338,0,0,1-2.6-1.259A3.12,3.12,0,0,1,0,8.676Zm20.407.671V2.5a1.15,1.15,0,0,0-1.139-1.14H2.5A1.149,1.149,0,0,0,1.362,2.5v.671ZM19.267,19.958H2.5a2.5,2.5,0,0,1-2.5-2.5v-4.07a.69.69,0,0,1,.689-.69.678.678,0,0,1,.674.69v4.07A1.149,1.149,0,0,0,2.5,18.6H19.267a1.15,1.15,0,0,0,1.139-1.138v-4.07a.682.682,0,1,1,1.363,0v4.07A2.5,2.5,0,0,1,19.267,19.958ZM6.243,4.538V8.5a1.984,1.984,0,0,0,3.968-.052V4.538Zm-4.881,0V8.676a1.76,1.76,0,1,0,3.519,0V4.538Zm10.214,0V8.453a1.974,1.974,0,1,0,3.948,0V4.538Z"
          transform="translate(0.674 0.74)"
          fill={color}
        />
      </G>
    </G>
  </Svg>
);

export default Marketplace;
