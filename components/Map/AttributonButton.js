import { TouchableOpacity } from 'react-native';
import AttributionIcon from '../../assets/svg/illustrations/AttributionIcon';

const AttributionButton = ({ showAttribution }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        showAttribution && showAttribution();
      }}>
      <AttributionIcon />
    </TouchableOpacity>
  );
};

export default AttributionButton;
