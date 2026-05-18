import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: RFValue(35),
    paddingHorizontal: RFValue(16),
    paddingBottom: RFValue(100),
    zIndex: 1,
  },
  screenTitle: {
    fontSize: RFValue(18),
    color: '#4A4A4A',
  },
  screenDescription: {
    fontSize: RFValue(14),
    color: '#B9C0CF',
  },
  screenTextMargin: {
    marginTop: RFValue(24),
  },
  shadow: {
    shadowColor: '#455B6314',
    shadowOffset: { height: 0, width: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 3,
  },
});
