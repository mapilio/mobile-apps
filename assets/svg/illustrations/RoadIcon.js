import Svg, { Path } from 'react-native-svg';
import { RFValue } from 'react-native-responsive-fontsize';

const RoadIcon = ({ width = RFValue(13), height = RFValue(13), fill = '#C2C2C2' }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 13.648 11.957">
    <Path
      id="road"
      d="M7.677,9.541v3.416h5.971L10.236,1H7.677V3.562H5.971V1H3.412L0,12.957H5.971V9.541ZM5.971,5.27H7.677V7.833H5.971Z"
      transform="translate(0 -1)"
      fill={fill}
    />
  </Svg>
);

export default RoadIcon;
