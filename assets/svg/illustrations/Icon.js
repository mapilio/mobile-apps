import * as React from "react";
import Svg, {G, Path, Circle} from "react-native-svg";

const Icon = ({ width = 32, height = 32 }) => {
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
        opacity="0.2"
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
          fill="#fff"
          data-name="Ellipse 2058"
        ></Circle>
        <G
          fill="none"
          stroke="#4a90e2"
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
  )
};

export default Icon;
