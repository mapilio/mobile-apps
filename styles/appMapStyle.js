import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const appMapStyles = StyleSheet.create({
  sequenceTitle: {
    fontSize: RFValue(18),
    color: "#4A4A4A",
  },
  sequenceDescription: {
    fontSize: RFValue(14),
    color: "#B9C0CF",
  },
  sequenceWrapper: {
    marginTop: RFValue(24),
    flexWrap: "wrap",
    flexDirection: "row",
  },
});
