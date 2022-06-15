import { Dimensions, Platform, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const loginStyles = StyleSheet.create({
  container: {
    backgroundColor: "#213348",
    justifyContent: "center",
  },
  logo: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: RFValue(30),
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
    fontSize: RFValue(24),
  },
  secondaryText: {
    fontSize: RFValue(16),
    lineHeight: RFValue(24),
    color: "#B9C0CF",
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: RFValue(4),
    height: RFValue(44),
    paddingHorizontal: RFValue(21),
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "#ed535a",
  },
  button: {
    borderRadius: RFValue(4),
    backgroundColor: "#22CC69",
    display: "flex",
    alignItems: "center",
    padding: RFValue(11),
    marginTop: RFValue(12),
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
    fontSize: RFValue(10),
    color: "#ed535a",
    marginTop: RFValue(2),
  },
  formGroup: {
    marginBottom: RFValue(18),
  },
  link: {
    color: "#4A90E2",
    fontSize: RFValue(12),
    marginBottom: RFValue(8),
    textAlign: "center",
  },
  privacyText: {
    marginTop: RFValue(39),
    textAlign: "center",
    color: "#fff",
    fontSize: RFValue(12),
  },
  passwordIcon: {
    position: "absolute",
    right: RFValue(20),
  },
});

export const socialLoginStyles = StyleSheet.create({
  container: {
    marginBottom: RFValue(20),
    justifyContent: "center",
    alignItems: "center",
  },
  topContainer: {
    flexDirection: "row",
    marginBottom: 20,
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
    backgroundColor: "#fff",
    color: "#FFFFFF",
    flex: 1,
    padding: 10,
    borderRadius: 20,
    marginRight: 6,
    justifyContent: "center",
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
