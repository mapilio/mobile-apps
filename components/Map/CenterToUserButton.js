import { TouchableOpacity } from "react-native";
import CurrentLocationIcon from "../../assets/svg/illustrations/CurrentLocationIcon";
import { appMapStyle } from "../../styles/appMapStyle";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const CenterToUserButton = ({ handleSetCenter, setShowUser }) => {
  return (
    <TouchableOpacity
      style={[appMapStyle.currentIcon]}
      onPress={() => {
        handleSetCenter();
      }}
      onLongPress={() => {
        setShowUser(prev => !prev);
        ReactNativeHapticFeedback.trigger("impactLight", {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false,
        });
      }}
    >
      <CurrentLocationIcon />
    </TouchableOpacity>
  );
};

export default CenterToUserButton;
