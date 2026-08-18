import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { convertHexToRGBA } from '../helper/helper';

export const infoAlertStyles = StyleSheet.create({
  alertTitle: {
    color: '#FFFFFF',
    fontSize: RFValue(12),
  },
  alertContainer: {
    backgroundColor: convertHexToRGBA('#488BDA', 90),
    borderLeftWidth: RFValue(15),
    borderLeftColor: '#130C47',
  },
  alertImage: {
    width: RFValue(33),
    height: RFValue(33),
    resizeMode: 'contain',
    marginRight: RFValue(9),
  },
});

export const warningAlertStyles = StyleSheet.create({
  alertTitle: {
    color: '#FFFFFF',
    fontSize: RFValue(12),
  },
  alertContainer: {
    backgroundColor: convertHexToRGBA('#FFC231', 90),
    borderLeftWidth: RFValue(15),
    borderLeftColor: '#CD9613',
  },
  alertImage: {
    width: RFValue(33),
    height: RFValue(33),
    resizeMode: 'contain',
    marginRight: RFValue(9),
  },
});

export const errorAlertStyles = StyleSheet.create({
  alertTitle: {
    color: '#FFFFFF',
    fontSize: RFValue(12),
  },
  alertContainer: {
    backgroundColor: convertHexToRGBA('#CA3031', 90),
    borderLeftWidth: RFValue(15),
    borderLeftColor: '#9F1010',
  },
  alertImage: {
    width: RFValue(33),
    height: RFValue(33),
    resizeMode: 'contain',
    marginRight: RFValue(9),
  },
});

export const successAlertStyles = StyleSheet.create({
  alertTitle: {
    color: '#FFFFFF',
    fontSize: RFValue(12),
  },
  alertContainer: {
    backgroundColor: convertHexToRGBA('#1AD971', 90),
    borderLeftWidth: RFValue(15),
    borderLeftColor: '#0DA753',
  },
  alertImage: {
    width: RFValue(33),
    height: RFValue(33),
    resizeMode: 'contain',
    marginRight: RFValue(9),
  },
});
