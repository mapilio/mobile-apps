import { TouchableOpacity } from 'react-native';
import AttributionIcon from '../../assets/svg/illustrations/AttributionIcon';

const AttributionButton = ({ showAttribution }) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Map attribution"
      onPress={() => {
        showAttribution && showAttribution();
      }}>
      <AttributionIcon />
    </TouchableOpacity>
  );
};

export default AttributionButton;
