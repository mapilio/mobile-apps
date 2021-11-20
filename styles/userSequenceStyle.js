import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const userSequenceStyles = StyleSheet.create({
  sequenceWrapper: {
    flexWrap: "wrap",
    flexDirection: "row",
  },
});

export const sequenceCardStyles = StyleSheet.create({
  cardContainer: {
    maxWidth: "31%",
    marginRight: RFValue(5),
    marginBottom: RFValue(5),
  },
  imageContainer: {
    position: "relative",
    height: RFValue(78),
    borderRadius: 8,
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
