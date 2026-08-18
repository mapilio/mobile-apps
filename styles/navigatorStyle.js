import { RFValue } from 'react-native-responsive-fontsize';

export const navigatorStyle = {
  headerStyle: {
    backgroundColor: '#FFF',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerSettingsStyle: {
    height: RFValue(50),
    backgroundColor: '#FFFFFF',
  },
  headerTitleStyle: {
    color: '#191919',
    fontFamily: 'Poppins-SemiBold',
    fontSize: RFValue(14),
  },
  cardStyle: {
    backgroundColor: '#FFF',
  },
  headerTintColor: '#ffffff',
  headerTitleAlign: 'center',
  captureButtonWrapperStyle: {
    width: RFValue(71),
    height: RFValue(71),
    borderRadius: RFValue(35),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    position: 'relative',
    bottom: RFValue(12),
  },
  captureButtonStyle: {
    width: RFValue(65),
    height: RFValue(65),
    borderRadius: RFValue(35),
    backgroundColor: '#191919',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    top: RFValue(20),
  },
  borderStyle: {
    borderColor: '#130C47',
  },
  tabTextStyle: {
    width: '100%',
    fontSize: 12,
    marginTop: 3,
    color: '#C2C2C2',
    fontFamily: 'Poppins-Medium',
  },
};
