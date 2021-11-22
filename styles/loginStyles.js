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
    marginBottom: 20,
  },
  primaryText: {
    fontSize: 26,
    lineHeight: 39,
    color: '#FFF'
  },
  secondaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#B9C0CF'
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 4,
    height: 44,
    paddingHorizontal: 21
  },
  button: {
    borderRadius: 4,
    backgroundColor: '#22CC69',
    display: "flex",
    alignItems:"center",
    padding: 11
  },
  buttonOutline: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1AD971',
    display: "flex",
    alignItems:"center",
    padding: 11
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    fontSize: 10, color: 'red'
  },
  formGroup: {
    marginBottom: 18
  },
  link: {
    color: "#4A90E2",
    fontSize: 12,
    marginBottom: 8,
    textAlign: "center",
  },
});
