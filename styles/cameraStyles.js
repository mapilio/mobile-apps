import { Dimensions, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { convertHexToRGBA } from '../helper/helper';

export const cameraStyles = StyleSheet.create({
  camera: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'black',
  },
  notReadyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
});

export const cameraAlertStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: RFValue(365),
    height: RFValue(155),
    backgroundColor: convertHexToRGBA('#191919', 90),
    paddingHorizontal: RFValue(18),
    paddingVertical: RFValue(25),
    borderRadius: 8,
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: RFValue(14),
    marginBottom: RFValue(6),
    marginTop: RFValue(15),
  },
  content: {
    color: '#808080',
    fontSize: RFValue(12),
    textAlign: 'center',
  },
});

export const cameraActionButtonStyles = StyleSheet.create({
  container: {
    width: RFValue(61),
    height: RFValue(61),
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  button: {
    position: 'absolute',
    top: '12%',
    left: '12%',
    bottom: '12%',
    right: '12%',
    borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBuffer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderWidth: RFValue(5),
    margin: RFValue(-2),
    borderColor: convertHexToRGBA('#FFFFFF', 10),
    borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
  },
});

export const cameraProjectModalStyles = {
  projectList: StyleSheet.create({
    outline: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: RFValue(20),
    },
    content: {
      margin: RFValue(20),
      backgroundColor: 'white',
      borderRadius: RFValue(6),
      padding: RFValue(35),
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: RFValue(2),
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: '90%',
    },
    close: {
      position: 'absolute',
      top: RFValue(15),
      right: RFValue(25),
      padding: RFValue(10),
    },
    title: {
      fontSize: RFValue(14),
      color: '#4A4A4A',
      alignSelf: 'flex-start',
      marginBottom: RFValue(10),
    },
    paragraph: {
      fontSize: RFValue(14),
      color: '#4A4A4A',
    },
    link: {
      color: '#4A90E2',
      fontSize: RFValue(14),
    },
  }),
};

export const fakeTasksStyle = {
  flex: 1,
  position: 'absolute',
  marginVertical: RFValue(14),
  marginHorizontal: RFValue(20),
  justifyContent: 'center',
  alignItems: 'center',
  left: 0,
  top: 0,
  right: 0,
};
