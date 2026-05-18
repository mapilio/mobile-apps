import { RFValue } from 'react-native-responsive-fontsize';
import { Svg, Path, G } from 'react-native-svg';

function CheckIcon({ width = RFValue(12), height = RFValue(12) }) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 13.643 10.544">
      <G data-name="checked (4)" transform="translate(-4.823 -6.317)">
        <Path
          fill="#fff"
          d="M110 120.754l-8.135 8.673a.919.919 0 01-1.4 0l-3.637-3.906a.952.952 0 011.4-1.291l2.938 3.153 7.436-7.866a.944.944 0 011.345-.054.928.928 0 01.053 1.291z"
          data-name="Path 23020"
          transform="translate(-91.766 -112.889)"></Path>
      </G>
    </Svg>
  );
}

export default CheckIcon;
