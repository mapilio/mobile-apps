import * as React from 'react';
import Svg, { G, Path, Rect } from 'react-native-svg';

const WarningIcon = ({ width = 32, height = 32 }) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 32 32">
      <G transform="translate(18683.084 -8294.916)">
        <Rect
          width="32"
          height="32"
          fill="rgba(255,255,255,0.2)"
          data-name="Rectangle 25981"
          rx="16"
          transform="translate(-18683.084 8294.916)"></Rect>
        <Path
          fill="#fff"
          d="M75.063 211.978l-6.425-10.655a2.873 2.873 0 00-4.842 0l-6.425 10.655a2.513 2.513 0 00-.042 2.513 2.825 2.825 0 002.463 1.424h12.85a2.822 2.822 0 002.463-1.391 2.513 2.513 0 00-.042-2.547zm-8.846.586a.838.838 0 11.592-.245.837.837 0 01-.592.246zm.838-3.351a.838.838 0 01-1.675 0v-3.351a.838.838 0 011.675 0z"
          data-name="Path 92093"
          transform="translate(-18733.301 8102.54)"></Path>
        <Path
          fill="#fba63c"
          d="M66.217 212.565a.838.838 0 11.592-.245.837.837 0 01-.592.245zm.838-3.351a.838.838 0 01-1.675 0v-3.351a.838.838 0 011.675 0z"
          data-name="Path 92094"
          transform="translate(-18733.301 8102.54)"></Path>
      </G>
    </Svg>
  );
};

export default WarningIcon;
