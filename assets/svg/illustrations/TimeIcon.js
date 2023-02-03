import {G, Path, Rect, Svg} from "react-native-svg";
import {RFValue} from "react-native-responsive-fontsize";

const TimeIcon = ({width = RFValue(20), height = RFValue(20)}) => {

  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 20 20">
      <G id="time_icon" transform="translate(-24 -530)">
        <Rect id="Rectangle_25987" data-name="Rectangle 25987" width="20" height="20" transform="translate(24 530)"
              opacity="0"/>
        <G id="time" transform="translate(24.611 530.691)" style="mix-blend-mode: normal;isolation: isolate">
          <Path id="Path_523" data-name="Path 523"
                d="M9.389,18.778a9.389,9.389,0,1,1,9.389-9.389A9.409,9.409,0,0,1,9.389,18.778Zm0-17.387a8,8,0,1,0,8,8A8.014,8.014,0,0,0,9.389,1.391Z"
                transform="translate(0 0)" fill="#d8d8d8"/>
          <Path id="Path_524" data-name="Path 524"
                d="M198.257,117.207h-3.732a.683.683,0,0,1-.7-.7V112.5a.7.7,0,1,1,1.391,0v3.315h3.037a.7.7,0,0,1,0,1.391Z"
                transform="translate(-185.228 -106.844)" fill="#d8d8d8"/>
        </G>
      </G>
    </Svg>
  )
}

export default TimeIcon;
