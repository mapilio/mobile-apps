import {StyleSheet} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";

export default StyleSheet.create({
  container: {
    marginHorizontal: RFValue(10),
    backgroundColor: '#FFF',
    marginBottom: RFValue(10),
    borderWidth: .3,
    borderColor: '#00000029',
    borderRadius: RFValue(5),
  },
  image: {
    width: "100%",
    height: RFValue(110),
    borderRadius: RFValue(5),
  },
  imageGradient: {
    zIndex: 9,
    position: "absolute",
    height: RFValue(110),
    flex: 1,
    width: "100%",
    borderRadius: RFValue(5),
  },
  info: {
    backgroundColor: '#FFF',
    paddingVertical: RFValue(5),
    paddingHorizontal: RFValue(10),
    justifyContent: 'space-between'
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
    marginTop: 'auto'
  },
  point: {
    color: '#130C47',
    fontFamily: 'Poppins-Medium',
    fontSize: RFValue(12),
  },
  deleteAction: {
    backgroundColor: '#D33030',
    justifyContent: 'center',
    width: RFValue(75),
    alignItems: 'center',
    zIndex: -1,
  },
  bold: {
    fontFamily: 'Poppins-SemiBold',
  }
});
