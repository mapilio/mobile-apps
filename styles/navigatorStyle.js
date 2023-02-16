import { RFValue } from "react-native-responsive-fontsize";
import { Dimensions, Platform } from "react-native";

export const navigatorStyle = {
  headerStyle: {
    backgroundColor: '#FFF',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0
  },
  headerSettingsStyle: {
    height: RFValue(50),
    backgroundColor: "#FFFFFF",
  },
  headerTitleStyle: {
    fontSize: RFValue(14),
    color: '#333333',
    fontFamily: "Poppins-SemiBold",
  },
  cardStyle: {
    backgroundColor: '#FFF',
  },
  headerTintColor: "#ffffff",
  headerTitleAlign: "center",
  captureButtonWrapperStyle: {
    width: RFValue(71),
    height: RFValue(71),
    borderRadius: RFValue(35),
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    position: "relative",
    bottom: RFValue(12),
  },
  captureButtonStyle: {
    width: RFValue(65),
    height: RFValue(65),
    borderRadius: RFValue(35),
    backgroundColor: "#130C47",
    justifyContent: "center",
    alignItems: "center",
  },
  tabIconStyle: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    borderBottomWidth: RFValue(3),
    borderColor: "transparent",
    width: "100%",
    flex: 1,
  },
  borderStyle: {
    borderColor: "#130C47",
  },
  tabTextStyle: {
    fontSize: 12,
    marginTop: 3,
    color: "#7E86B0",
    fontFamily: "Poppins-Medium",
  },
};
