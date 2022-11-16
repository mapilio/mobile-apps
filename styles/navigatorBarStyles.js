import { StyleSheet, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const sequenceLeft = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: RFValue(16),
  },
  backTitle: {
    fontSize: RFValue(16),
    color: "#D8D8D8",
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
    color: "#4A90E2",
    fontSize: RFValue(16),
    marginRight: RFValue(5),
    marginTop: Platform.OS === "ios" ? RFValue(-6) : 0,
  },
});

export const sequenceTitle = StyleSheet.create({
  title: {
    color: "#FFF",
    fontSize: RFValue(16),
    marginTop: Platform.OS === "ios" ? RFValue(-6) : 0,
  },
});

export const deleteRight = StyleSheet.create({
  text: {
    color: "#FFF",
    fontSize: RFValue(14),
    right: RFValue(10),
  },
});

export const uploadRight = StyleSheet.create({
  container: {
    marginBottom: -5,
    marginRight: RFValue(10),
  },
});

export const generalSettingsLeft = StyleSheet.create({
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

export const sequenceDetailTitle = StyleSheet.create({
  rank: {
    color: "#FFF",
    fontSize: RFValue(16),
  },
  active: {
    color: "#1AD971",
  },
});
