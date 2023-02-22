import Svg, {Circle, G, Path} from "react-native-svg";
import {RFValue} from "react-native-responsive-fontsize";

const CameraFilledIcon = ({width = RFValue(13), height= RFValue(13) }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 13.044 11.957">
    <G id="camera" transform="translate(0 -1)">
      <Circle id="Ellipse_1923" data-name="Ellipse 1923" cx="2.3" cy="2.3" r="2.3" transform="translate(4.222 5.138)" fill="#C2C2C2"/>
      <Path id="Path_81194" data-name="Path 81194" d="M10.87,2.631H9.631l-.174-.516A1.619,1.619,0,0,0,7.913,1H5.131A1.619,1.619,0,0,0,3.587,2.114l-.174.516H2.174A2.174,2.174,0,0,0,0,4.8v5.979a2.174,2.174,0,0,0,2.174,2.174h8.7a2.174,2.174,0,0,0,2.174-2.174V4.8A2.174,2.174,0,0,0,10.87,2.631ZM6.522,10.783A3.261,3.261,0,1,1,9.783,7.522,3.261,3.261,0,0,1,6.522,10.783Z" transform="translate(0 0)" fill="#d8d8d8"/>
    </G>
  </Svg>
)

export default CameraFilledIcon;
