import {StyleSheet} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";

export default StyleSheet.create({
  skeletonItem: {
    height: RFValue(120),
    borderRadius: RFValue(4),
    width: "100%",
    marginTop: RFValue(10)
  },
  container: {
    flex: 1,
  },
  list: {
    backgroundColor: '#FFF',
    paddingTop: RFValue(10)
  },
  noFeedWrapper: {
    marginTop: RFValue(50),
    alignItems: "center",
  },
  noFeedTitle: {
    fontFamily: "Poppins-Medium",
    fontSize: RFValue(16),
    color: "#191919",
    textAlign: "center",
    paddingTop: RFValue(20)
  },
  noFeedDescription: {
    fontFamily: "Poppins",
    fontSize: RFValue(14),
    color: "#808080",
    marginVertical: RFValue(10),
    textAlign: "center"
  },
  noFeedButton:{
    backgroundColor: "#0056F1",
    marginLeft: "auto",
    marginRight: "auto",
    marginVertical: RFValue(20),
    paddingHorizontal: RFValue(25),
    paddingVertical: RFValue(13),
    borderRadius: RFValue(24),
    alignItems: "center",
    justifyContent: "center",
    text: {
      color: "#FFF",
      fontSize: RFValue(16),
    }
  }
});
