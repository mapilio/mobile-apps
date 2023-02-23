import {Dimensions, StyleSheet} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: RFValue(18),
    justifyContent: "space-between",
  },
  content: {
    alignItems: "center",
  },
  title: {
    color: "#130C47",
    fontFamily: "Poppins-Medium",
    fontSize: RFValue(16),
    marginTop: RFValue(28),
  },
  description: {
    color: "#666666",
    fontFamily: "Poppins",
    fontSize: RFValue(14),
    marginTop: RFValue(10),
    textAlign: "center",
  },
  button: {
    backgroundColor: "#EC4E2C",
    marginBottom: RFValue(46),
  }
})
