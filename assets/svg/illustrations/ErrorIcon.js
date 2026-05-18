import * as React from 'react';
import Svg, { G, Path, Circle } from 'react-native-svg';

const ErrorIcon = ({ width = 32, height = 32 }) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 32 32">
      <G transform="translate(18725 -8267)">
        <G data-name="Group 85335" transform="translate(-18725 8267)">
          <Circle
            cx="16"
            cy="16"
            r="16"
            fill="rgba(255,255,255,0.2)"
            data-name="Ellipse 2057"></Circle>
        </G>
        <G data-name="Group 118951" transform="translate(-18719.535 8272.54)">
          <Circle cx="10.46" cy="10.46" r="10.46" fill="#fff" data-name="Ellipse 2058"></Circle>
          <Path
            fill="none"
            stroke="#ec4e2c"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.458"
            d="M7.994 12.925l4.931-4.931"
            data-name="Path 91260"></Path>
          <Path
            fill="none"
            stroke="#ec4e2c"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.458"
            d="M12.924 12.925L7.993 7.994"
            data-name="Path 223393"></Path>
        </G>
      </G>
    </Svg>
  );
};

export default ErrorIcon;
