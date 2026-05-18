import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import Svg, { Path } from 'react-native-svg';

const Play = ({ width = RFValue(18), height = RFValue(20) }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 17.995 19.995">
    <Path
      id="play_1_"
      data-name="play (1)"
      d="M33.485,9.126l-16-9A1,1,0,0,0,16,1V19a1,1,0,0,0,1.49.872l16-9a1,1,0,0,0,0-1.744Z"
      transform="translate(-16 0)"
      fill="#2e2e2e"
    />
  </Svg>
);

export default Play;
