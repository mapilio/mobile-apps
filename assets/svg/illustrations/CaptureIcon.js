import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import Svg, { Path } from 'react-native-svg';

const CaptureIcon = ({ width = RFValue(28.719), height = RFValue(31.331) }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 31.331 28.719">
    <Path
      fill="#fff"
      d="M-2502.778-1001.281a5.222 5.222 0 01-5.222-5.219v-14.36a5.222 5.222 0 015.222-5.221h2.976l.418-1.24a3.887 3.887 0 013.707-2.676h6.684a3.886 3.886 0 013.707 2.676l.418 1.24h2.976a5.222 5.222 0 015.222 5.221v14.36a5.222 5.222 0 01-5.222 5.222zm2.611-13.054a7.832 7.832 0 007.833 7.832 7.84 7.84 0 007.832-7.832 7.832 7.832 0 00-7.832-7.832 7.832 7.832 0 00-7.833 7.832zm2.308-.2a5.525 5.525 0 015.524-5.525 5.525 5.525 0 015.525 5.525 5.524 5.524 0 01-5.525 5.524 5.524 5.524 0 01-5.524-5.524z"
      data-name="Path 195036"
      transform="translate(2508 1030)"></Path>
  </Svg>
);

export default CaptureIcon;
