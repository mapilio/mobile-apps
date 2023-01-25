import { Image } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

/**
 * Returns the icon for the tooltip content title
 * @param {string} tabName
 * @example TitleIcon("map") => <Image source={require("../../../assets/images/tooltip/earth.png")} style={{width:24,height:24}} />
 */
export const TitleIcon = ({ tabName }) => {

 const icons = {
  map: require("../../../assets/images/tooltip/map.png"),
  marketplace: require("../../../assets/images/tooltip/marketplace.png"),
  upload: require("../../../assets/images/tooltip/upload.png"),
  leaderboard: require("../../../assets/images/tooltip/leaderboard.png"),
  capture: require("../../../assets/images/tooltip/capture.png"),
  angle: require("../../../assets/images/tooltip/angle.png"),
  tasks: require("../../../assets/images/tooltip/tasks.png"),
  startCapture:require("../../../assets/images/tooltip/capture.png"),
  list: require("../../../assets/images/tooltip/list.png"),
  apply: require("../../../assets/images/tooltip/apply.png"),
 }

 if(!icons[tabName]) return null;

  return (
    <Image
      source={icons[tabName]}
      style={{ width: RFValue(24), height: RFValue(24) }}
    />  )
};
