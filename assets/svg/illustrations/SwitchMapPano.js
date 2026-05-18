import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import Svg, { Path } from 'react-native-svg';

const SwitchMapPano = ({ width = RFValue(24), height = RFValue(24), props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 28.971 28.971">
    <Path
      fill="#fff"
      d="M9.282 19.524V11.2H.96a.959.959 0 110-1.919h8.322V.959a.961.961 0 011.922 0v8.323h8.322a.959.959 0 110 1.919H11.2v8.323a.961.961 0 11-1.922 0z"
      transform="rotate(45 7.243 17.486)"></Path>
  </Svg>
);

export default SwitchMapPano;
