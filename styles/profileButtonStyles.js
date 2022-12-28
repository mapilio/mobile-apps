import { StyleSheet } from "react-native";
import { RFValue,RFPercentage } from "react-native-responsive-fontsize";
export const profileButtonStyles = StyleSheet.create({
  profileButton: {
    position: "absolute",
    backgroundColor:"#666666",
    borderRadius: RFValue(50),
    top: RFValue(10.25),
    zIndex: 5,
    right: RFValue(20.25),
    alignItems: "flex-end",
  },
  profileIcon: {
    width: RFValue(38),
    height: RFValue(38),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFPercentage(50),
  },
});
