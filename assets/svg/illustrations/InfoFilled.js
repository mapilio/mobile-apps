import { RFValue } from 'react-native-responsive-fontsize';
import {Svg, Path, G, Circle, } from 'react-native-svg';


const InfoFilled = ({width=RFValue(32), height=RFValue(32)}) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 32 32"
    >
      <G transform="translate(18725 -8267)">
        <G
          data-name="Group 85335"
          opacity="0.5"
          transform="translate(-18725 8267)"
        >
          <Circle
            cx="16"
            cy="16"
            r="16"
            fill="#fff"
            data-name="Ellipse 2057"
          ></Circle>
        </G>
        <G data-name="Group 85336" transform="translate(-18719.535 8272.465)">
          <Circle
            cx="10.46"
            cy="10.46"
            r="10.46"
            fill="#4a90e2"
            data-name="Ellipse 2058"
          ></Circle>
          <G
            fill="none"
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.458"
            data-name="Group 85353"
          >
            <Path d="M10.459 13.783V9.14" data-name="Path 91260"></Path>
            <Path d="M10.459 7.137h0" data-name="Path 92095"></Path>
          </G>
        </G>
      </G>
    </Svg>
  );
}

export default InfoFilled;
