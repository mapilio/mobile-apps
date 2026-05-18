import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Svg, Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

const Campus = ({ width = RFValue(39), height = RFValue(39) }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 34.944 33">
    <G data-name="Group 3914" transform="translate(0 -.209)">
      <G
        fill="#666"
        stroke="#d8d8d8"
        strokeWidth="0.5"
        data-name="Ellipse 123"
        opacity="0.75"
        transform="translate(1.944 .209)">
        <Circle cx="16.5" cy="16.5" r="16.5" stroke="none"></Circle>
        <Circle cx="16.5" cy="16.5" r="16.25" fill="none"></Circle>
      </G>
      <Path
        fill="#d8d8d8"
        d="M0 2.113a11.745 11.745 0 0113.441 0L6.72 14.53z"
        data-name="Intersection 4"
        opacity="0.77"
        transform="translate(11.583 2.098)"></Path>
      <Path
        fill="#d33030"
        d="M0 5.635L1.31 0a26.436 26.436 0 004.233 4.365L0 5.635z"
        data-name="Subtraction 2"
        opacity="0.75"
        transform="rotate(78 .787 4.999)"></Path>
    </G>
  </Svg>
);

export default Campus;
