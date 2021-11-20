import { StyleSheet, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const sequenceLeft = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: RFValue(16),
  },
  backTitle: {
    fontSize: RFValue(16),
    color: "#B9C0CF",
    marginBottom: Platform.OS === "ios" ? 0 : RFValue(-2),
    marginLeft: RFValue(3),
  },
});

export const sequenceRight = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: RFValue(10),
  },
  title: {
    color: "#B9C0CF",
    fontSize: RFValue(16),
    marginRight: RFValue(16),
    marginTop: Platform.OS === "ios" ? RFValue(-6) : 0,
  },
});

export const uploadRight = StyleSheet.create({
  container: {
    marginBottom: -5,
    marginRight: RFValue(10),
  },
});
