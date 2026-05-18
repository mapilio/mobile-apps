import * as React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import Svg, { Path } from 'react-native-svg';

const CleanRoad = ({ width = RFValue(78), height = RFValue(83) }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 78.203 83.418">
    <Path
      d="M62.508 2.102a2.606 2.606 0 0 0-2.555-2.1H18.245a2.606 2.606 0 0 0-2.554 2.1L.05 80.302a2.618 2.618 0 0 0 .542 2.164 2.588 2.588 0 0 0 2.012.954h72.99a2.609 2.609 0 0 0 2.56-3.118Z"
      fill="#4a90e2"
    />
    <Path
      d="M24.346 72.365a2.642 2.642 0 0 1-.674-2.97l13.029-31.282a2.507 2.507 0 0 1 2.4-1.459 2.507 2.507 0 0 1 2.4 1.459l13.031 31.282a2.642 2.642 0 0 1-.679 2.971 2.693 2.693 0 0 1-1.718.623 2.515 2.515 0 0 1-1.357-.363l-11.677-7.042-11.681 7.041a2.671 2.671 0 0 1-1.352.369 2.7 2.7 0 0 1-1.722-.629Zm12.146-41.08V20.854h5.214v10.431Zm0-20.855V0h5.214v10.43Z"
      fill="#fff"
    />
  </Svg>
);

export default CleanRoad;
