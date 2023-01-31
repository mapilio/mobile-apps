import { Platform, StyleSheet } from "react-native";
import { RFValue,RFPercentage } from "react-native-responsive-fontsize";
import {globalStyles} from "./globalStyles";
export const profileButtonStyles = StyleSheet.create({
  profileButton: {
    position: "absolute",
    backgroundColor: "#666666",
    borderRadius: RFValue(50),
    zIndex: 5,
    top: Platform.OS === "android" && RFValue(5),
    right: RFValue(20.25),
    alignItems: "flex-end",
    ...globalStyles.shadow,
  },
  profileIcon: {
    width: RFValue(52),
    height: RFValue(52),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFPercentage(50),
    position: "relative",
    zIndex: -1,
  },
  profileImage: {
    width: RFValue(55),
    height: RFValue(55),
    borderRadius: RFPercentage(50),
  },
  indicator: {
    position: "absolute",
    left:0,
    right:0,
    top:0,
    bottom:0,
  },
});
