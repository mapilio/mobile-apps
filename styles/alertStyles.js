import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { convertHexToRGBA } from "../helper/helper";

export const infoAlertStyles = StyleSheet.create({
  alertTitle: {
    color: "#FFFFFF",
    fontSize: RFValue(12),
  },
  alertContainer: {
    backgroundColor: convertHexToRGBA("#488BDA", 90),
    borderLeftWidth: RFValue(15),
    borderLeftColor: "#213348",
  },
  alertImage: {},
});

export const warningAlertStyles = StyleSheet.create({
  alertTitle: {
    color: "#FFFFFF",
    fontSize: RFValue(12),
  },
  alertContainer: {
    backgroundColor: convertHexToRGBA("#FFC231", 90),
    borderLeftWidth: RFValue(15),
    borderLeftColor: "#CD9613",
  },
  alertImage: {},
});

export const errorAlertStyles = StyleSheet.create({
  alertTitle: {
    color: "#FFFFFF",
    fontSize: RFValue(12),
  },
  alertContainer: {
    backgroundColor: convertHexToRGBA("#CA3031", 90),
    borderLeftWidth: RFValue(15),
    borderLeftColor: "#9F1010",
  },
  alertImage: {},
});

export const successAlertStyles = StyleSheet.create({
  alertTitle: {
    color: "#FFFFFF",
    fontSize: RFValue(12),
  },
  alertContainer: {
    backgroundColor: convertHexToRGBA("#1AD971", 90),
    borderLeftWidth: RFValue(15),
    borderLeftColor: "#0DA753",
  },
  alertImage: {},
});
