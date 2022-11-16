import Svg, {Path} from "react-native-svg";
import {RFValue} from "react-native-responsive-fontsize";

const SettingsDots = ({width = RFValue(19), height = RFValue(5), color = '#fff'}) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 19 5">
      <Path id="Path_95679" data-name="Path 95679" d="M-6301-942.5a2.5,2.5,0,0,1,2.5-2.5,2.5,2.5,0,0,1,2.5,2.5,2.5,2.5,0,0,1-2.5,2.5A2.5,2.5,0,0,1-6301-942.5Zm-7,0a2.5,2.5,0,0,1,2.5-2.5,2.5,2.5,0,0,1,2.5,2.5,2.5,2.5,0,0,1-2.5,2.5A2.5,2.5,0,0,1-6308-942.5Zm-7,0a2.5,2.5,0,0,1,2.5-2.5,2.5,2.5,0,0,1,2.5,2.5,2.5,2.5,0,0,1-2.5,2.5A2.5,2.5,0,0,1-6315-942.5Z" transform="translate(6315 945.001)" fill={color}/>
    </Svg>
  )
}

export default SettingsDots;
