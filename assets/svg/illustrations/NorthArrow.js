import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const NorthArrow = ({ width = 7, height = 7 }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 7.902 7.897">
    <Path
      d="m3.78 0 3.23 4.8a26.436 26.436 0 0 0-6.08.119L3.781 0Z"
      fill="#c22e2e"
      opacity={0.75}
    />
  </Svg>
);

export default NorthArrow;
