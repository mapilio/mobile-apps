import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import Svg, { Path } from 'react-native-svg';

const CurrentLocationIcon = ({ width = RFValue(16), height = RFValue(16), fill = '#808080' }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 17.91 17.525">
    <Path
      fill={fill}
      d="M15.949-.24a1.111 1.111 0 011 1.6l-7.586 15.3a1.111 1.111 0 01-2.1-.358l-.733-6.061L.078 9.166A1.111 1.111 0 01-.2 7.062l15.69-7.2a1.1 1.1 0 01.459-.102zm-7.3 14.765L14.92 1.87 1.877 7.856l6.087 1.02z"
      data-name="gps (2)"
      transform="translate(.85 .24)"></Path>
  </Svg>
);

export default CurrentLocationIcon;
