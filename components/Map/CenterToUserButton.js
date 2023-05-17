import { TouchableOpacity } from "react-native";
import CurrentLocationIcon from "../../assets/svg/illustrations/CurrentLocationIcon";
import { appMapStyle } from "../../styles/appMapStyle";
import { vibrate } from "../../util/helpers";

const CenterToUserButton = ({ handleSetCenter, setShowUser }) => {
  return (
    <TouchableOpacity
      style={[appMapStyle.centerButton]}
      onPress={() => {
        handleSetCenter();
      }}
      onLongPress={() => {
        vibrate("medium")
        setShowUser(prev => !prev);
      }}
    >
      <CurrentLocationIcon />
    </TouchableOpacity>
  );
};

export default CenterToUserButton;
