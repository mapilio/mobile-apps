import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const leaderStyles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  headerTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
  },
  headerSubTitle: {
    fontFamily: "Poppins",
    fontSize: 15,
    paddingTop: 5,
  },
  subScreens: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  screenOptionsStyles: {
    tabBarLabelStyle: { fontSize: 14, fontFamily: "Poppins-SemiBold" },
  },
  authUserListItem: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
    marginVertical: 5,
    paddingLeft: 3,
    backgroundColor: "#3F8BE9",
    borderRadius: 5,
    rank: {
      text: {
        fontFamily: "Poppins",
        fontSize: 16,
        paddingLeft: 12,
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
  listItem: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    rank: {
      text: {
        fontFamily: "Poppins",
        fontSize: 16,
        minWidth: RFValue(22),
      },
      rankers: {
        fontSize: 14,
        color: "white",
        minWidth: RFValue(22),
        height: RFValue(22),
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFC700",
        text: {
          color: "white",
        },
      },
    },
    displayName: {
      fontFamily: "Poppins",
      fontSize: 16,
      marginLeft: 10,
    },
  },
  profilePhoto: {
    borderRadius: 50,
    marginLeft: 10,
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
  }
});
