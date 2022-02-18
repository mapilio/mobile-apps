import { Dimensions, Platform, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const userUploadStyles = StyleSheet.create({
  container: {
    paddingVertical: RFValue(35),
    paddingHorizontal: RFValue(16),
  },
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
  textWhite: {
    color: "#FFF",
  },
  listItem: {
    backgroundColor: "#EDEFF1",
    flex: 1,
    marginBottom: 10,
  },
  backRightBtn: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    position: "absolute",
    width: 75,
    backgroundColor: "#D33030",
    right: 0,
  },
  deleteButton: {
    backgroundColor: "#D33030",
    height: RFValue(45),
    width: RFValue(45),
    position: "absolute",
    right: RFValue(30),
    bottom:
      Platform.OS === "android"
        ? RFValue(80)
        : Dimensions.get("window").height > 1000
        ? RFValue(85)
        : Dimensions.get("window").height > 775
        ? RFValue(120)
        : RFValue(110),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFValue(45),
  },
});

export const userUploadModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4D4D4D",
  },
  text: {
    color: "#FFF",
    marginVertical: RFValue(5),
  },
  progressBar: {
    borderRadius: RFValue(4),
    width: Dimensions.get("window").width - RFValue(100),
  },
  close: {
    position: "absolute",
    top: RFValue(40),
    right: RFValue(15),
  },
});
