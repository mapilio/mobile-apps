import { RFValue } from "react-native-responsive-fontsize";

export const navigatorStyle = {
  headerStyle: {
    height: RFValue(80),
    backgroundColor: "#213348",
  },
  headerTitleStyle: {
    fontSize: RFValue(16),
  },
  headerTintColor: "#ffffff",
  headerTitleAlign: "center",
  tabBarStyle: {
    height: RFValue(60)
  },
  captureButtonWrapperStyle: {
    width: RFValue(70),
    height: RFValue(70),
    borderRadius: RFValue(35),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#171717',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    position: 'relative',
    top: RFValue(-15),
  },
  captureButtonStyle: {
    width: RFValue(64),
    height: RFValue(64),
    borderRadius: RFValue(35),
    backgroundColor: '#32425B',
  },
};
