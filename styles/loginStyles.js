import { Dimensions, Platform, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const loginStyles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: RFValue(28),
    backgroundColor: "#FFFFFF",
  },
  logo: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: RFValue(10),
    paddingTop: RFValue(35),
  },
  primaryText: {
    fontSize: RFValue(20),
    lineHeight: RFValue(39),
    paddingTop: RFValue(10),
    color: "#191919",
    fontFamily:"Poppins-SemiBold"
  },
  smallText: {
    color: "#CBD1D9",
    fontSize: RFValue(14),
  },
  headerText: {
    color: "#191919",
    fontSize: RFValue(14),
    textAlign: "center",
    fontFamily:"Poppins"
  },
  secondaryText: {
    fontSize: RFValue(14),
    color: "#808080",
    fontFamily:"Poppins",
  },
  input: {
    backgroundColor: "#ECECEC",
    borderRadius: RFValue(24),
    height: RFValue(46),
    paddingHorizontal: RFValue(21),
    fontSize: RFValue(15),
    fontFamily:"Poppins-Light"
  },
  errorInput: {
    borderWidth: 1,
    backgroundColor: '#EC4E2C1A',
    borderColor: "#EC4E2C",
  },
  button: {
    marginTop: RFValue(5),
    borderRadius: RFValue(24),
    backgroundColor: "#0056F1",
    display: "flex",
    alignItems: "center",
    height: RFValue(48),
    justifyContent: "center",
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
    color: "#EC4E2C",
    paddingRight: RFValue(15),
    fontFamily:"Poppins"
  },
  formGroup: {
    marginBottom: RFValue(14),
  },
  link: {
    color: "#4A90E2",
    fontSize: RFValue(10),
    marginBottom: RFValue(8),
    textAlign: "center",
  },
  policy: {
    paddingTop: RFValue(30),
  },
  privacyText: {
    textAlign: "center",
    color: "##808080",
    fontSize: RFValue(10),
    marginBottom: RFValue(25),
    paddingBottom: RFValue(10),
    fontFamily:"Poppins"
  },
  forgotPassword: {
    color: "#191919",
    fontSize: RFValue(12),
    paddingVertical: RFValue(5),
    paddingHorizontal: RFValue(10),
    fontFamily:"Poppins-Medium"
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
    opacity: 0.3,
    height: 1,
    width: "35%",
   
  },
  bottomText: {
    paddingHorizontal: 15,
    color: "#808080",
  },
  googleButton: {
    padding: Dimensions.get("window").height > 1100 ? 20 : 10,
    borderRadius: 1000,
    marginLeft: 6,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    width: 50,
    height: 50,
  },
  appleButton: {
    borderRadius: 20,
    marginRight: 6,
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  facebookButton: {
    padding: 10,
    borderRadius: 1000,
    marginRight: 20,
    marginLeft: Platform.OS === "android" ? 0 : 20,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 1,
    width: 50,
    height: 50,
  },
});
