import { StyleSheet, Dimensions } from "react-native";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";

export const appMapStyle = StyleSheet.create({
  mapWrapper: {
    width: RFValue(Dimensions.get("window").width),
    // width: RFPercentage(100),
    height: RFPercentage(100),
  },
  map: {
    width: RFValue(Dimensions.get("window").width ),
    height: RFPercentage(100),
    paddingBottom: RFValue(90),
  },
  searchIcon: {
    backgroundColor: "rgba(50, 66, 91, 0.9)",
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
    bottom: RFValue(141),
    left: RFValue(16),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFPercentage(0.5),
  },
  minimizePano: {
    position: "absolute",
    bottom: RFValue(113),
    right: RFValue(16),
    zIndex: 1,
  },
});
