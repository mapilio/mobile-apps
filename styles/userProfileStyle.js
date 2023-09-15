import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const colors = {
  completed: { color: '#2DAE51' },
  uploaded: { color: '#3F8BE9' },
  processing: { color: '#FBA63C' },
  fail: { color: '#C1452B' },
};

export const userFeedStyles = StyleSheet.create({
  wrapper: {
    marginBottom: RFValue(10),
    borderRadius: RFValue(8),
    marginHorizontal: RFValue(10),
  },
  imageWrapper: { height: RFValue(110) },
  imageStyle: {
    width: '100%',
    height: RFValue(110),
    resizeMode: 'cover',
    borderRadius: RFValue(8),
    zIndex: 0,
    position: 'absolute',
  },
  imageGradient: {
    zIndex: 9,
    position: 'absolute',
    height: RFValue(110),
    flex: 1,
    borderRadius: RFValue(8),
    width: '100%',
    borderWidth: 0.3,
  },
  info: {
    position: 'absolute',
    justifyContent: 'space-between',
    left: RFValue(10),
    bottom: RFValue(10),
  },
  subInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  address: {
    color: 'white',
    fontSize: RFValue(12),
    fontFamily: 'Poppins-Medium',
  },
  date: {
    color: 'white',
    fontSize: RFValue(10),
    fontFamily: 'Poppins',
  },
  imageCount: {
    position: 'absolute',
    right: RFValue(10),
    bottom: RFValue(10),
    zIndex: 1,
    alignItems: 'center',
    text: {
      color: '#FFF',
    },
  },
  status: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    left: RFValue(10),
    top: RFValue(10),
    borderRadius: RFValue(3),
    overflow: 'hidden',
    text: {
      fontSize: RFValue(10),
      color: '#FFF',
      paddingLeft: RFValue(5),
      paddingVertical: RFValue(2),
    },
    flag:{
      height: RFValue(18),
      width: RFValue(10),
      borderRadius: RFValue(4),
    },
    uploaded: { backgroundColor: colors.uploaded.color },
    completed: { backgroundColor: colors.completed.color },
    processing: { backgroundColor: colors.processing.color },
    fail: { backgroundColor: colors.fail.color },
  },
});
