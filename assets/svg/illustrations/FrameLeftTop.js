import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import Svg, { G, Path } from 'react-native-svg';

const FrameLeftTop = ({ width = RFValue(88), height = RFValue(55) }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={width}
    height={height}
    viewBox="0 0 88.625 54.785">
    <G transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#Path_23000)">
      <Path
        id="Path_23000-2"
        data-name="Path 23000"
        d="M-13167.668,18165.586V18117.8h81.625"
        transform="translate(13171.67 -18114.3)"
        fill="none"
        stroke="#fff"
        stroke-width="2"
      />
    </G>
  </Svg>
);

export default FrameLeftTop;
