import { StyleSheet } from "react-native";
import { RFValue,RFPercentage } from "react-native-responsive-fontsize";
import {globalStyles} from "./globalStyles";
export const profileButtonStyles = StyleSheet.create({
  profileButton: {
    borderRadius: RFValue(50),
    right: RFValue(20.25),
    position:"absolute",
    alignItems: "flex-end",
    ...globalStyles.shadow,
  },
  profileIcon: {
    width: RFValue(52),
    backgroundColor: "#666666",
    height: RFValue(52),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFPercentage(50),
    position: "relative",
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
