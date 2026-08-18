import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: RFValue(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  noFeedTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: RFValue(16),
    color: '#333333',
    textAlign: 'center',
    paddingTop: RFValue(30),
  },
  noFeedDescription: {
    fontFamily: 'Poppins',
    fontSize: RFValue(14),
    color: '#666666',
    marginVertical: RFValue(10),
    textAlign: 'center',
  },
  slideItem: {
    marginHorizontal: RFValue(20),
  },
  slideGradient: {
    paddingHorizontal: RFValue(20),
    borderRadius: RFValue(8),
    minHeight: RFValue(110),
    justifyContent: 'center',
  },
  slideTitle: {
    color: '#FFFFFF',
    fontSize: RFValue(12),
    fontFamily: 'Poppins-SemiBold',
    paddingBottom: RFValue(4),
    position: 'relative',
  },
  slideDescription: {
    color: '#FFFFFF',
    fontSize: RFValue(11),
    fontFamily: 'Poppins',
    lineHeight: RFValue(14),
    width: '100%',
  },
  paginationContainer: {
    paddingTop: RFValue(14),
    paddingBottom: RFValue(24),
  },
  dotStyle: {
    height: RFValue(6),
    width: RFValue(24),
    borderRadius: RFValue(6),
    backgroundColor: 'rgba(204,204,204,0.3)',
    marginHorizontal: RFValue(3),
  },
  dotStyleActive: {
    height: RFValue(6),
    backgroundColor: '#3F8BE9',
  },
  inactiveDotStyle: {
    backgroundColor: '#D8D8D8',
    width: RFValue(6),
    height: RFValue(6),
    borderRadius: RFValue(5),
    marginHorizontal: RFValue(3),
  },
});
