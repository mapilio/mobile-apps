import { StyleSheet, Dimensions } from "react-native";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";

export const appMapStyle = StyleSheet.create({
  map: {
    width: Dimensions.get("screen").width,
    position: "relative"
  },
  searchIcon: {
    backgroundColor: "rgba(19, 12, 71, 1)",
    padding: RFValue(8),
    width: RFValue(35.5),
    height: RFValue(35.5),
    position: "absolute",
    zIndex: 5,
    top: 10.25,
    right: 16.25,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFPercentage(50),
  },
  currentIcon: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: RFValue(8),
    width: RFValue(26),
    height: RFValue(26),
    position: "absolute",
    zIndex: 5,
    left: RFValue(15),
    bottom: RFValue(15),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFPercentage(0.5),
  },
  minimizePano: {
    position: "absolute",
    right: RFValue(15),
    zIndex: 1,
    bottom: RFValue(15)
  },
});
