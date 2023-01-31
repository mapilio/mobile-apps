import { RFValue } from "react-native-responsive-fontsize";
import {Svg, Path, G} from "react-native-svg";

function RightTopDirectionIcon({width=RFValue(10), height=RFValue(10)}) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 9.983 9.983"
    >
      <G
        fill="none"
        stroke="#3f8be9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        data-name="Component 16 – 1"
        transform="translate(1.061 1.061)"
      >
        <Path d="M0 0h7.862v7.862" data-name="Path 201081"></Path>
        <Path d="M7.862 0L0 7.862" data-name="Path 201082"></Path>
      </G>
    </Svg>
  );
}

export default RightTopDirectionIcon;