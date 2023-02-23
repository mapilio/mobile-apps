import { Platform, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { statusBarPadding } from "../util/consts/ui";

export const leaderStyles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop:statusBarPadding,
  },
  container: {
    flex: 1,
    paddingHorizontal: Platform.isPad ? 20: 10,
  },
  headerSubTitle: {
    fontFamily: "Poppins",
    color: "#808080",
    marginTop: 20,
    fontSize: 15,
    paddingTop: 5,
  },
  subScreens: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  authUserListItem: {
    flexDirection: "row",
    width: "100%",
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
        fontSize: RFValue(12),
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
      color:"#191919"
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
