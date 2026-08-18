import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

export default StyleSheet.create({
  container: {
    marginHorizontal: RFValue(10),
    backgroundColor: '#FFF',
    marginBottom: RFValue(10),
    borderWidth: 0.3,
    borderColor: '#00000029',
    borderRadius: RFValue(5),
  },
  image: {
    width: '100%',
    height: RFValue(110),
    borderRadius: RFValue(5),
  },
  imageGradient: {
    zIndex: 9,
    position: 'absolute',
    height: RFValue(110),
    flex: 1,
    width: '100%',
    borderRadius: RFValue(5),
  },
  info: {
    backgroundColor: '#FFF',
    paddingVertical: RFValue(5),
    paddingHorizontal: RFValue(10),
    justifyContent: 'space-between',
  },
  address: {
    color: '#191919',
    fontSize: RFValue(12),
    fontFamily: 'Poppins-Medium',
  },
  subInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  count: {
    color: '#FFF',
    fontSize: RFValue(10),
    fontFamily: 'Poppins',
    position: 'absolute',
    right: RFValue(10),
    bottom: RFValue(5),
    zIndex: 10,
  },
  date: {
    color: '#808080',
    fontSize: RFValue(10),
    fontFamily: 'Poppins',
    marginTop: 'auto',
  },
  point: {
    color: '#191919',
    fontFamily: 'Poppins-Medium',
    fontSize: RFValue(12),
  },
  deleteAction: {
    justifyContent: 'center',
    width: RFValue(75),
    alignItems: 'center',
    zIndex: -1,
  },
  bold: {
    fontFamily: 'Poppins-SemiBold',
  },
});
