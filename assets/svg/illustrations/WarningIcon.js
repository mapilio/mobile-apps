import * as React from "react";
import Svg, {G, Path, Circle} from "react-native-svg";

const WarningIcon = ({ width = 32, height = 32 }) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 32 32">
      <G id="warning_icon" transform="translate(18725 -8267)">
        <G id="Group_85335" data-name="Group 85335" transform="translate(-18725 8267)">
          <Circle id="Ellipse_2057" data-name="Ellipse 2057" cx="16" cy="16" r="16" fill="rgba(251,166,60,0.2)"/>
        </G>
        <G id="Group_85336" data-name="Group 85336" transform="translate(-18719.535 8272.465)">
          <Circle id="Ellipse_2058" data-name="Ellipse 2058" cx="10.46" cy="10.46" r="10.46" transform="translate(0 0)" fill="#fba63c"/>
          <G id="Group_85353" data-name="Group 85353">
            <Path id="Path_91260" data-name="Path 91260" d="M33.615,212.873V208.23" transform="translate(-23.156 -199.09)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.458"/>
            <Path id="Path_92095" data-name="Path 92095" d="M33.615,208.23v0" transform="translate(-23.156 -201.093)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.458"/>
          </G>
        </G>
      </G>
    </Svg>
  )
};

export default WarningIcon;
