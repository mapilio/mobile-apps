import {StyleSheet} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";

export default StyleSheet.create({
  container: {
    flex: 1,
    marginTop: RFValue(50),
    alignItems: 'center',
    justifyContent: 'center',
    padding: RFValue(20),
  },
  noFeedTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: RFValue(16),
    color: '#333333',
    textAlign: 'center',
    paddingTop: RFValue(30),
  },
  noFeedDescription: {
    fontFamily: 'Poppins',
    fontSize: RFValue(14),
    color: '#666666',
    marginVertical: RFValue(10),
    textAlign: 'center',
  }
});
