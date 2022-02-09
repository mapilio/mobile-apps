import { RFValue } from "react-native-responsive-fontsize";
import { Dimensions, Platform } from "react-native";

export const navigatorStyle = {
  headerStyle: {
    height:
      Platform.OS === "android"
        ? RFValue(50)
        : Dimensions.get("window").height > 1100
        ? RFValue(55)
        : Dimensions.get("window").height > 775
        ? RFValue(90)
        : RFValue(80),
    backgroundColor: "#213348",
  },
  headerSettingsStyle: {
    height: RFValue(50),
    backgroundColor: "#4B4D51",
  },
  headerTitleStyle: {
    fontSize: RFValue(16),
  },
  headerTintColor: "#ffffff",
  headerTitleAlign: "center",
  tabBarStyle: {
    height:
      Platform.OS === "android"
        ? RFValue(63)
        : Dimensions.get("window").height > 1100
        ? RFValue(56)
        : Dimensions.get("window").height > 775
        ? RFValue(83)
        : RFValue(63),
    position: "absolute",
    bottom: 0,
  },
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
    backgroundColor: "#32425B",
    justifyContent: "center",
    alignItems: "center",
  },
  tabIconStyle: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    paddingBottom: RFValue(2.5),
    borderBottomWidth: RFValue(3),
    borderColor: "transparent",
    paddingLeft: RFValue(10),
    paddingRight: RFValue(10),
  },
  borderStyle: {
    borderColor: "#32425B",
  },
  tabTextStyle: {
    fontSize: 12,
    marginTop: 3,
    color: "#7E86B0",
    fontFamily: "Poppins-SemiBold",
  },
};
