import { StyleSheet, Dimensions } from 'react-native';
import { RFValue, RFPercentage } from 'react-native-responsive-fontsize';
import { globalStyles } from './globalStyles';

export const appMapStyle = StyleSheet.create({
  map: {
    width: Dimensions.get('screen').width,
    position: 'relative',
    height: '100%',
  },
  topWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    zIndex: 2,
  },
  search: {
    alignItems: 'center',
    ...globalStyles.shadow,
  },
  searchIcon: {
    backgroundColor: '#FFFFFF',
    padding: RFValue(8),
    width: RFValue(66),
    height: RFValue(36),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RFPercentage(50),
  },
  mapButtons: {
    position: 'absolute',
    flexDirection: 'column',
    zIndex: 2,
    right: RFValue(15),
    bottom: RFValue(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: RFValue(35),
    height: RFValue(35),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RFValue(30),
    marginBottom: RFValue(5),
    ...globalStyles.shadow,
  },
  watermark: {
    position: 'absolute',
    bottom: RFValue(10),
    left: RFValue(10),
    zIndex: 2,
    resizeMode: 'contain',
  },
  minimizePano: {
    position: 'absolute',
    right: RFValue(15),
    zIndex: 1,
    bottom: RFValue(15),
  },
});
