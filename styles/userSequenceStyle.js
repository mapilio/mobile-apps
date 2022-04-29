import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const userSequenceStyles = StyleSheet.create({
  sequenceWrapper: {
    flexWrap: "wrap",
    flexDirection: "row",
  },
  tabBar: {
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    zIndex: 999999999999999999999999999,
    position: "absolute",
  },
  tabItem: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 3,
    backgroundColor: "#F5F5F5",
    width: 150,
  },
  tabItemActive: {
    backgroundColor: "#32425B",
    borderRadius: 5,
  },
  tabText: {
    color: "#32425B",
  },
  tabTextActive: {
    color: "#FFF",
  },
});

export const sequenceCardStyles = StyleSheet.create({
  cardContainer: {
    maxWidth: "33.3%",
    paddingHorizontal: RFValue(2),
    marginBottom: RFValue(5),
    borderRadius: 4,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    height: RFValue(78),
    borderRadius: 4,
    maxWidth: "100%",
  },
  imagePosition: { position: "relative" },
  imageStyle: {
    height: RFValue(78),
    borderRadius: 8,
    maxWidth: "100%",
  },
  iconStyle: {
    position: "absolute",
    bottom: RFValue(8),
    right: RFValue(8),
  },
});

export const sequenceDetailStyles = StyleSheet.create({
  imageArea: {
    position: "relative",
  },
  image: {
    width: "100%",
  },
  resizeButton: {
    position: "absolute",
    right: RFValue(10),
  },
  minimizeButton: {
    bottom: RFValue(10),
  },
  maximizeButton: {
    bottom: RFValue(30),
  },
});
