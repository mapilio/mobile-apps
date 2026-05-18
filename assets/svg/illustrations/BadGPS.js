import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import Svg, { G, Path } from 'react-native-svg';

const BadGPS = ({ width = RFValue(16), height = RFValue(14) }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 55.946 50.093">
    <G data-name="Group 120120" transform="translate(-372.527 -115.758)">
      <Path
        fill="#fba63c"
        d="M48.487 50.094H7.46a7.462 7.462 0 01-6.445-11.225l11.08-18.994L21.529 3.7a7.462 7.462 0 0112.891 0l20.513 35.169a7.465 7.465 0 01-6.446 11.225zM27.973 3.234a4.243 4.243 0 00-3.653 2.1L3.807 40.5a4.229 4.229 0 003.653 6.358h41.027a4.231 4.231 0 003.654-6.358L31.627 5.333a4.243 4.243 0 00-3.654-2.099z"
        data-name="Union 434"
        transform="translate(372.527 115.758)"></Path>
      <Path
        fill="#fff"
        d="M2.193 22.318a2.193 2.193 0 112.191-2.193 2.2 2.2 0 01-2.191 2.193zm0-6.961A1.835 1.835 0 01.36 13.524V1.832a1.832 1.832 0 013.665 0v11.692a1.834 1.834 0 01-1.832 1.833z"
        data-name="Subtraction 115"
        transform="translate(398.308 133.148)"></Path>
    </G>
  </Svg>
);

export default BadGPS;
