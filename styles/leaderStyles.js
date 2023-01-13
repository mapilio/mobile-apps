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
  howToScore: {
    position: "absolute",
    flexDirection: "row",
    right: 0,
  },
  howToScoreText: {
    color: "#3F8BE9",
    fontSize: RFValue(10),
    fontFamily: "Poppins-SemiBold",
    textAlign: "right",
    paddingRight: RFValue(3),
  },
  headerSubTitle: {
    fontFamily: "Poppins",
    color: "#666666",
    marginTop: 20,
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
        minWidth: RFValue(40),
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
        fontSize: RFValue(12),
        minWidth: RFValue(22),
      },
      rankers: {
        width: RFValue(22),
        height: RFValue(22),
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFC700",
        text: {
          fontSize: RFValue(12),
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
