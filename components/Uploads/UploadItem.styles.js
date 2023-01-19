import {StyleSheet} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";

export default StyleSheet.create({
  container: {
    marginHorizontal: RFValue(10),
    backgroundColor: '#FFF',
    shadowColor: '#00000029',
    shadowOffset: {height: 0, width: 3},
    shadowOpacity: .9,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: RFValue(10),
    borderWidth: .3,
    borderColor: '#00000029',
    borderRadius: 4,
  },
  image: {
    width: "100%",
    height: RFValue(110),
  },
  imageGradient: {
    zIndex: 9,
    position: "absolute",
    height: RFValue(110),
    flex: 1,
    width: "100%",
  },
  info: {
    backgroundColor: '#FFF',
    paddingVertical: RFValue(5),
    paddingHorizontal: RFValue(10),
  },
  address: {
    color: '#130C47',
    fontSize: RFValue(12),
    fontFamily: "Poppins-Medium",
  },
  subInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  count: {
    color: '#FFF',
    fontSize: RFValue(10),
    fontFamily: 'Poppins',
    position: 'absolute',
    right: RFValue(10),
    bottom: RFValue(5),
    zIndex: 10,
  },
  date: {
    color: '#666666',
    fontSize: RFValue(10),
    fontFamily: 'Poppins',
  },
  deleteAction: {
    backgroundColor: '#D33030',
    justifyContent: 'center',
    width: RFValue(75),
    alignItems: 'center',
    zIndex: -1,
  },
});
