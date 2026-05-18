import { Dimensions, Platform, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

export const userUploadStyles = StyleSheet.create({
  container: {
    paddingVertical: RFValue(35),
    paddingHorizontal: RFValue(16),
  },
  sequenceTitle: {
    fontSize: RFValue(18),
    color: '#4A4A4A',
  },
  sequenceDescription: {
    fontSize: RFValue(14),
    color: '#B9C0CF',
  },
  sequenceWrapper: {
    marginTop: RFValue(24),
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  textWhite: {
    color: '#FFF',
  },
  listItem: {
    backgroundColor: '#EDEFF1',
    flex: 1,
    marginBottom: 10,
  },
  backRightBtn: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: 75,
    backgroundColor: '#D33030',
    right: 0,
  },
  deleteButton: {
    backgroundColor: '#D33030',
    height: RFValue(45),
    width: RFValue(45),
    position: 'absolute',
    right: RFValue(30),
    bottom:
      Platform.OS === 'android'
        ? RFValue(80)
        : Dimensions.get('window').height > 1000
          ? RFValue(85)
          : Dimensions.get('window').height > 775
            ? RFValue(120)
            : RFValue(110),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RFValue(45),
  },
});

export const userUploadModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: RFValue(12),
    paddingVertical: RFValue(78),
  },
  header: {
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: RFValue(10),
    fontSize: RFValue(20),
    color: '#191919',
  },
  subtitle: {
    textAlign: 'center',
    paddingBottom: RFValue(20),
    fontSize: RFValue(14),
    color: '#808080',
  },
  text: {
    color: '#FFF',
    marginVertical: RFValue(5),
  },
  sequenceInfo: {
    backgroundColor: 'rgba(63,139,233,0.1)',
    height: RFValue(127),
    borderRadius: RFValue(20),
    paddingHorizontal: RFValue(15),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  sequenceInfoSide: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  sequenceInfoText: {
    fontSize: RFValue(14),
    color: '#808080',
  },
  sequenceInfoTextBold: {
    fontSize: RFValue(20),
    color: '#191919',
  },
  progressBar: {
    borderRadius: RFValue(4),
    width: Dimensions.get('window').width - RFValue(100),
  },
  separator: {
    borderLeftColor: '#D8D8D8',
    height: RFValue(35),
    borderLeftWidth: 1,
  },
  bottomBar: {
    width: Dimensions.get('window').width,
    alignItems: 'center',
    paddingBottom: RFValue(80),
  },
  close: {
    color: '#808080',
    fontSize: RFValue(16),
  },
  closeIcon: {
    width: RFValue(24),
    height: RFValue(24),
    borderRadius: RFValue(24),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C2C2C2',
    marginTop: RFValue(10),
  },
});
