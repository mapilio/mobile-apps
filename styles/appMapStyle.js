import { StyleSheet } from "react-native";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";

export const appMapStyle = StyleSheet.create({
  map: {
    flex: 1,
    width: RFPercentage(100),
    height: RFPercentage(100),
    paddingBottom: RFValue(67),
  }
});
