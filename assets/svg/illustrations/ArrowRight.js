import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { G, Svg, Path } from 'react-native-svg';

const ArrowRight = ({ width = RFValue(11), height = RFValue(11), fill = '#fff' }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 13.765 12.711">
      <G fill={fill} data-name="Group 69876">
        <Path
          d="M.756 8.185a.7.7 0 01-.523-.233A.7.7 0 010 7.429V.7a.7.7 0 111.4 0v6.08h6.08a.7.7 0 110 1.4z"
          transform="rotate(-135 6.503 4.419)"></Path>
        <Path
          d="M.205 7.791L7.791.205a.7.7 0 01.992.992L1.2 8.783a.7.7 0 01-.992-.992z"
          data-name="union"
          transform="rotate(-135 5.81 5.04)"></Path>
      </G>
    </Svg>
  );
};

export default ArrowRight;
