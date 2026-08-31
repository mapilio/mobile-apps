import { TouchableOpacity } from 'react-native';
import CurrentLocationIcon from '../../assets/svg/illustrations/CurrentLocationIcon';
import { appMapStyle } from '../../styles/appMapStyle';
import { vibrate } from '../../util/helpers';

const CenterToUserButton = ({ handleSetCenter, setShowUser }) => {
  const toggleNearbyUsers = () => {
    vibrate('medium');
    setShowUser((previous) => !previous);
  };

  return (
    <TouchableOpacity
      style={[appMapStyle.centerButton]}
      accessibilityRole="button"
      accessibilityLabel="Center map on my location"
      accessibilityHint="Use the additional action to show or hide nearby contributors"
      accessibilityActions={[{ name: 'longpress', label: 'Show or hide nearby contributors' }]}
      onAccessibilityAction={({ nativeEvent }) => {
        if (nativeEvent.actionName === 'longpress') {
          toggleNearbyUsers();
        }
      }}
      onPress={() => {
        handleSetCenter();
      }}
      onLongPress={toggleNearbyUsers}>
      <CurrentLocationIcon />
    </TouchableOpacity>
  );
};

export default CenterToUserButton;
