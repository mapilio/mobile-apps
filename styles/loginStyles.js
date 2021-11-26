import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const loginStyles = StyleSheet.create({
  container: {
    backgroundColor: "#213348",
    justifyContent: "center",
  },
  logo: {
    width: "50%",
    display: "flex",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: RFValue(20),
  },
  primaryText: {
    fontSize: RFValue(26),
    lineHeight: RFValue(39),
    color: '#FFF'
  },
  smallText: {
    color: '#CBD1D9',
    fontSize: RFValue(14)
  },
  secondaryText: {
    fontSize: RFValue(16),
    lineHeight: RFValue(24),
    color: '#B9C0CF'
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: RFValue(4),
    height: RFValue(44),
    paddingHorizontal: RFValue(21)
  },
  button: {
    borderRadius: RFValue(4),
    backgroundColor: '#22CC69',
    display: "flex",
    alignItems:"center",
    padding: RFValue(11)
  },
  buttonOutline: {
    borderRadius: RFValue(4),
    borderWidth: RFValue(1),
    borderColor: '#1AD971',
    display: "flex",
    alignItems:"center",
    padding: RFValue(11)
  },
  buttonText: {
    color: "#fff",
    fontSize: RFValue(16),
  },
  errorText: {
    fontSize: RFValue(10), color: 'red'
  },
  formGroup: {
    marginBottom: RFValue(18)
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
    color: '#fff',
    fontSize: RFValue(12),
  },
});
