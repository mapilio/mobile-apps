import {StyleSheet} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";

export default StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: RFValue(10),
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
  },
  score: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: RFValue(5),
  },
  scoreText: {
    fontSize: RFValue(16),
    fontFamily: "Poppins-SemiBold",
    marginLeft: RFValue(5),
  },
  button: {
    minWidth: RFValue(160),
  },
  content: {
    flex: 1,
    paddingHorizontal: RFValue(10),
    paddingTop: RFValue(15),
  },
  address: {
    fontSize: RFValue(15),
    fontFamily: "Poppins-SemiBold",
    color: "#333333",
  },
  date: {
    fontSize: RFValue(13),
    fontFamily: "Poppins",
    color: "#666666",
    marginTop: RFValue(5),
    marginBottom: RFValue(20),
  },
  itemWrapper: {
    flex: 1,
    marginRight: RFValue(5),
    borderRadius: RFValue(10),
    overflow: "hidden",
    height: RFValue(75),
    marginBottom: RFValue(5),
    zIndex: 1,
  },
  image: {
    height: "100%",
    width: 'auto',
  },
  selectedWrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#00000066",
    borderColor: "#3F8BE9",
    borderWidth: 1.5,
    borderRadius: RFValue(10),
  },
  selectedIcon: {
    position: "absolute",
    right: RFValue(5),
    bottom: RFValue(5),
    width: RFValue(20),
    height: RFValue(20),
    backgroundColor: "#3F8BE9",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFValue(20),
  },
  clearSelection: {
    position: "absolute",
    right: RFValue(20),
    top: RFValue(47),
  },
  clearSelectionText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: "#3F8BE9",
    textDecorationLine: "underline",
  },
  trashIcon: {
    backgroundColor: '#D33030',
    width: RFValue(50),
    height: RFValue(50),
    borderRadius: RFValue(25),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: RFValue(20),
    bottom: RFValue(20),
    zIndex: 10
  }
});
