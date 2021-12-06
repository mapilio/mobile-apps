import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const walkthroughStyle = StyleSheet.create({
  image: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: "auto",
  },
  title: {
    fontSize: RFValue(18),
    color: "#fff",
    marginTop: RFValue(30),
  },
  desc: {
    fontSize: RFValue(14),
    color: "#fff",
    textAlign: "center",
    marginTop: RFValue(8),
    marginBottom: RFValue(30),
  },
  centeredView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#2a2b2f",
    width: "100%",
    height: "100%",
    color: "white",
    alignItems: "center",
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
  },
  hide: {
    display: "none",
  },
  dotStyle: {
    width: RFValue(10),
    height: RFValue(10),
    borderRadius: RFValue(5),
    backgroundColor: "#fff",
    borderWidth: RFValue(1),
    borderColor: "#fff",
  },
  inactiveDotStyle: {
    backgroundColor: "transparent",
    borderColor: "#fff",
  },
  nextButton: {
    fontSize: RFValue(14),
    color: "#fff",
  },
  prevButton: {
    fontSize: RFValue(14),
    color: "#B9C0CF",
  },
});
