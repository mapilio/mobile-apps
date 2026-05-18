import { RFValue } from 'react-native-responsive-fontsize';
import { Svg, Path } from 'react-native-svg';

const ChargeIcon = ({ width = RFValue(6), height = RFValue(12) }) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 5.56 7.966">
      <Path
        fill="#fff"
        d="M64.319 135.207l-1.158 3.361h2.552l-4.165 4.605 1.158-3.361h-2.553z"
        data-name="battery (3)"
        transform="translate(-60.153 -135.207)"></Path>
    </Svg>
  );
};

export default ChargeIcon;
