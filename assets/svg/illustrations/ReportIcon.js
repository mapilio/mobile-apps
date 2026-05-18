import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import Svg, { Path, G } from 'react-native-svg';

const ReportIcon = ({ width = RFValue(16), height = RFValue(17) }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 18 18">
    <G id="report" transform="translate(-5649 -9747.964)">
      <G id="Group_117488" data-name="Group 117488" transform="translate(5649 9747.965)">
        <Path
          id="Path_202073"
          data-name="Path 202073"
          d="M9.5,5,5,9.5v6.36l4.5,4.5h6.36l4.5-4.5V9.5L15.856,5Z"
          transform="translate(-3.692 -3.66)"
          fill="#fff"
          opacity="0.15"
        />
        <Path
          id="Subtraction_114"
          data-name="Subtraction 114"
          d="M12.73,18H5.27L0,12.73V5.27L5.27,0H12.73L18,5.27V12.73L12.73,18ZM5.814,1.31h0l-4.5,4.5v6.372l4.5,4.5h6.372l4.5-4.5V5.814l-4.5-4.5Z"
          transform="translate(0 0)"
          fill="#fff"
          opacity="0.6"
        />
        <Path
          id="Path_202074"
          data-name="Path 202074"
          d="M0,8.984a1,1,0,1,1,1,1A1,1,0,0,1,0,8.984Zm0-2V0H2V6.988Z"
          transform="translate(7.986 4.025)"
          fill="#fff"
          opacity="0.6"
        />
      </G>
    </G>
  </Svg>
);

export default ReportIcon;
