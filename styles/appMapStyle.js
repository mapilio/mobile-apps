import { StyleSheet, Dimensions } from "react-native";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";

export const appMapStyle = StyleSheet.create({
  map: {
    width: Dimensions.get("screen").width,
    position: "relative"
  },
  search: {
    position: "absolute",
    top: RFValue(10.25),
    zIndex: 5,
    width: Dimensions.get("screen").width,
    alignItems: "center"
  },
  searchIcon: {
    backgroundColor: "#FFFFFF",
    padding: RFValue(8),
    width: RFValue(68),
    height: RFValue(36),
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
