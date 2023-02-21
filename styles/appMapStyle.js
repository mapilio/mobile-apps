import { StyleSheet, Dimensions } from "react-native";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
import {globalStyles} from "./globalStyles";

export const appMapStyle = StyleSheet.create({
  map: {
    width: Dimensions.get("screen").width,
    position: "relative",
    height: "100%",
  },
  topWrapper:{position:"absolute", justifyContent:"center", alignItems:"center", width:"100%"},
  search: {
    alignItems: "center",
    ...globalStyles.shadow,
  },
  searchIcon: {
    backgroundColor: "#FFFFFF",
    padding: RFValue(8),
    width: RFValue(66),
    height: RFValue(36),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFPercentage(50),
  },
  currentIcon: {
    backgroundColor: "rgba(255,255,255,0.9)",
    width: RFValue(40),
    height: RFValue(40),
    position: "absolute",
    zIndex: 8,
    right: RFValue(15),
    bottom: RFValue(12),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFValue(30),
    ...globalStyles.shadow,
  },
  minimizePano: {
    position: "absolute",
    right: RFValue(15),
    zIndex: 1,
    bottom: RFValue(15)
  },
});
