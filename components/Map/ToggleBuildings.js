import { vibrate } from "../../util/helpers";
import { TouchableOpacity } from "react-native";
import { appMapStyle } from "../../styles/appMapStyle";
import { RFValue } from "react-native-responsive-fontsize";
import ThreeDIcon from "../../assets/svg/illustrations/ThreeDIcon";

const ToggleBuildings = ({ toggleBuildings, isActive }) => {
  return (
    <TouchableOpacity
      style={{...appMapStyle.mapButton, bottom: RFValue(55)}}
      onPress={() => {
        vibrate("medium");
        toggleBuildings(prev => !prev);
      }}
     
    >
     <ThreeDIcon fill={isActive ? "#0056F1" : "#808080"}  />
    </TouchableOpacity>
  );
};


export default ToggleBuildings;
