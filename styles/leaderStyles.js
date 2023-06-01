import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const leaderStyles = StyleSheet.create({
  screenOptions: {
    tabBarAndroidRipple: false,
    tabBarStyle: {
      backgroundColor: "#fff",
      elevation: 0,
    },
    tabBarPressColor: "transparent",
  },
  tabBarLabel: {
    width: RFValue(36),
    height: RFValue(15),
    marginLeft: RFValue(5),
    borderTopRightRadius: RFValue(8),
    borderBottomLeftRadius: RFValue(8),
    borderTopLeftRadius: RFValue(2),
    borderBottomRightRadius: RFValue(2),
    backgroundColor: "#EB1515",
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  base: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: RFValue(14),
  },
  headerSubTitle: {
    fontFamily: "Poppins",
    color: "#808080",
    marginTop: 20,
    fontSize: RFValue(13),
    textAlign:"center"
  
  },
  subScreens: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  authUserListItem: {
    flexDirection: "row",
    marginRight: RFValue(1),
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#0056F1",
    borderRadius: 5,
    rank: {
      text: {
        fontFamily: "Poppins-Medium",
        fontSize: RFValue(12),
        minWidth: RFValue(22),
        color: "white",
      },
    },
    displayName: {
      fontFamily: "Poppins",
      fontSize: 16,
      marginLeft: 10,
      color: "white",
    },
  },
  seperator: {
    height: 1,
    width: "100%",
    backgroundColor: "#ECECEC",
    marginVertical: 3,
    marginHorizontal: 5,
  },
  listItem: {
    flexDirection: "column",
    width: "100%",
    alignItems: "flex-start",
    paddingHorizontal: 10,
    borderRadius: 15,
    rank: {
      text: {
        fontFamily: "Poppins-Medium",
        fontSize: 14,
        minWidth: RFValue(22),
      },
      rankers: {
        width: RFValue(22),
        height: RFValue(22),
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FBA63C",
        text: {
          fontSize: RFValue(12),
          color: "white",
          fontFamily: "Poppins",
        },
      },
    },
    displayName: {
      fontFamily: "Poppins",
      fontSize: 16,
      marginLeft: 10,
      color: "#191919",
    },
  },
  profilePhoto: {
    marginLeft: 10,
    width: 42,
    height: 42,
    justifyContent: "center",
  },
  fallbackImage: {
    width: 42,
    height: 42,
    marginLeft: 10,
    color: "#FFFFFF",
    backgroundColor: "#D8D8D8",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    text: { fontSize: 18, color: "#FFFFFF" },
  },
  authUserInList: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
 
});
