import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import Svg, { Circle, G, Path } from 'react-native-svg';

const SelectedIcon = ({ width = RFValue(19), height = RFValue(19) }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 19 19">
    <G id="Group_47475" data-name="Group 47475" transform="translate(-100 -240)">
      <G
        id="Ellipse_1645"
        data-name="Ellipse 1645"
        transform="translate(100 240)"
        fill="#1ad971"
        stroke="#fff"
        stroke-width="1">
        <Circle cx="9.5" cy="9.5" r="9.5" stroke="none" />
        <Circle cx="9.5" cy="9.5" r="9" fill="none" />
      </G>
      <Path
        id="Path_22992"
        data-name="Path 22992"
        d="M174.754,184.69l-4.993,4.993-1.733-1.733a.749.749,0,0,0-1.06,1.06l2.263,2.263a.74.74,0,0,0,.53.218.766.766,0,0,0,.53-.218l5.517-5.517a.749.749,0,0,0-1.054-1.066Z"
        transform="translate(-61.888 61.517)"
        fill="#fff"
      />
    </G>
  </Svg>
);

export default SelectedIcon;
