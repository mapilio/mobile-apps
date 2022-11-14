import { Dimensions, Platform, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const loginStyles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#130C47',
    shadowOpacity: 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: RFValue(28),
    backgroundColor: "#130C47",
  },
  logo: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  primaryText: {
    fontSize: RFValue(26),
    lineHeight: RFValue(39),
    color: "#FFF",
  },
  smallText: {
    color: "#CBD1D9",
    fontSize: RFValue(14),
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: RFValue(14),
    textAlign: "center"
  },
  secondaryText: {
    fontSize: RFValue(16),
    lineHeight: RFValue(24),
    color: "#B9C0CF",
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: RFValue(24),
    height: RFValue(44),
    paddingHorizontal: RFValue(21),
    fontSize: RFValue(15)
  },
  errorInput: {
    borderWidth: 1,
    backgroundColor: '#FBEDEC',
    borderColor: "#ed535a",
  },
  button: {
    borderRadius: RFValue(24),
    backgroundColor: "#3F8BE9",
    display: "flex",
    alignItems: "center",
    padding: RFValue(11),
  },
  buttonOutline: {
    borderRadius: RFValue(4),
    borderWidth: RFValue(1),
    borderColor: "#1AD971",
    display: "flex",
    alignItems: "center",
    padding: RFValue(11),
  },
  buttonText: {
    color: "#fff",
    fontSize: RFValue(16),
  },
  errorText: {
    textAlign: "right",
    fontSize: RFValue(10),
    color: "#EC6A56",
    paddingRight: RFValue(15)
  },
  formGroup: {
    marginBottom: RFValue(18),
  },
  link: {
    color: "#4A90E2",
    fontSize: RFValue(10),
    marginBottom: RFValue(8),
    textAlign: "center",
  },
  policy: {
    width: Dimensions.get("window").width,
    position: "absolute",
    bottom: 0,
    paddingBottom: 60,
  },
  privacyText: {
    textAlign: "center",
    color: "#fff",
    fontSize: RFValue(10),
  },
  passwordIcon: {
    position: "absolute",
    right: RFValue(20),
    bottom: RFValue(14),
  },
});

export const socialLoginStyles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: RFValue(21)
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    backgroundColor: "#CBD1D9",
    opacity: 0.7,
    height: 1,
    flex: 1,
  },
  bottomText: {
    paddingHorizontal: 15,
    color: "#B9C0CF",
  },
  googleButton: {
    padding: Dimensions.get("window").height > 1100 ? 20 : 10,
    borderRadius: 1000,
    marginLeft: 6,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
  },
  appleButton: {
    color: "#657488",
    borderRadius: 20,
    marginRight: 6,
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  facebookButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 1000,
    marginRight: 20,
    marginLeft: Platform.OS === "android" ? 0 : 20,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
});
