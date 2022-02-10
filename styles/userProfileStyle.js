import { Platform, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { convertHexToRGBA } from "../helper/helper";

export const userFeedStyles = StyleSheet.create({
  feedContainer: {
    width: "100%",
    backgroundColor: convertHexToRGBA("#CBD1D9", 20),
    borderRadius: 4,
    paddingVertical: RFValue(12),
    paddingHorizontal: RFValue(16),
    flexDirection: "row",
    marginBottom: RFValue(5),
  },
  viewStyle: {
    flexDirection: "column",
    flex: 1,
    marginRight: RFValue(20),
  },
  dateStyle: {
    fontSize: RFValue(14),
    color: "#4A4A4A",
    marginBottom: RFValue(9),
  },
  descriptionStyle: {
    fontSize: RFValue(14),
    color: "#4A4A4A",
    flexWrap: "nowrap",
  },
  imageStyle: {
    width: RFValue(130),
    height: RFValue(70),
    resizeMode: "cover",
    borderRadius: 4,
  },
});

export const userInfoStyles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row",
    paddingHorizontal: Platform.OS === "ios" ? RFValue(8) : RFValue(20),
    paddingBottom: RFValue(31),
  },
  imageStyle: {
    borderRadius: RFValue(71) / 2,
    resizeMode: "cover",
    width: RFValue(71),
    height: RFValue(71),
    marginRight: RFValue(22),
  },
  indicatorStyle: {
    backgroundColor: convertHexToRGBA("#4A4A4A", 10),
    width: RFValue(71),
    height: RFValue(71),
    marginRight: RFValue(22),
    borderRadius: RFValue(71) / 2,
    position: "absolute",
    left: RFValue(10),
    bottom: 0,
    right: 0,
    top: 0,
  },
  username: {
    color: "#4a4a4a",
    fontSize: RFValue(18),
  },
  accountType: {
    color: "#4a4a4a",
    fontSize: RFValue(12),
    marginTop: Platform.OS === "android" ? RFValue(-4) : 0,
  },
  infoGrid: {
    display: "flex",
    flexDirection: "row",
    marginTop: RFValue(3),
  },
  infoTitle: {
    textTransform: "uppercase",
    fontSize: RFValue(12),
    color: "#A4A9C7",
    opacity: 0.6,
  },
  infoValue: {
    fontSize: RFValue(18),
    color: "#5B687C",
  },
  infoContainer: {
    flexDirection: "column",
    marginRight: RFValue(16),
  },
});
