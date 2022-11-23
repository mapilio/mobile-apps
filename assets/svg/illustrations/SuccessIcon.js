import * as React from "react";
import Svg, {G, Path, Circle} from "react-native-svg";

const SuccessIcon = ({width = 32, height = 32}) => {
  return (

    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 32 32">
      <G id="success_icon" transform="translate(18725 -8267)">
        <G id="Group_85335" data-name="Group 85335" transform="translate(-18725 8267)">
          <Circle id="Ellipse_2057" data-name="Ellipse 2057" cx="16" cy="16" r="16" fill="rgba(56,179,90,0.2)"/>
        </G>
        <G id="Group_85336" data-name="Group 85336" transform="translate(-18719.535 8272.465)">
          <Circle id="Ellipse_2058" data-name="Ellipse 2058" cx="10.46" cy="10.46" r="10.46" transform="translate(0 0)" fill="#38b35a"/>
          <Path id="Path_91260" data-name="Path 91260" d="M31.149,211.849l2.465,2.466,4.931-4.931" transform="translate(-24.667 -200.879)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.458"/>
        </G>
      </G>
    </Svg>
  )
};

export default SuccessIcon;
