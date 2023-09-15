import {StyleSheet } from "react-native";
import { RFValue} from "react-native-responsive-fontsize";

const colors = {
  completed: {color: '#2DAE51'},
  uploaded: {color: '#3F8BE9'},
  processing: {color: '#FBA63C'},
  fail: {color: '#C1452B'},
}

export const userFeedStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFF',
    shadowColor: '#00000029',
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: .9,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: RFValue(10),
    borderWidth: .3,
    borderColor: '#00000029',
    borderRadius: RFValue(8),
    marginHorizontal: RFValue(10),
  },
  imageWrapper: {height: RFValue(100)},
  imageStyle: {
    width: "100%",
    height: RFValue(100),
    resizeMode: "cover",
    borderTopLeftRadius: RFValue(8),
    borderTopRightRadius: RFValue(8),
    zIndex: 8,
    position: "absolute",
    top: 0,
    left: 0,
  },
  imageGradient: {
    zIndex: 9,
    position: "absolute",
    height: RFValue(100),
    flex: 1,
    width: "100%",
    borderTopRightRadius: RFValue(8),
    borderTopLeftRadius: RFValue(8),
    borderWidth: .3,
  },
  info: {
    justifyContent: "space-between",
    padding: RFValue(10)
  },
  subInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  address:{
    color: "#191919",
    fontSize: RFValue(12),
    fontFamily: "Poppins-Medium",
  },
  date: {
    color: '#808080',
    fontSize: RFValue(10),
    fontFamily: "Poppins",
  },
  imageCount:{
    position: "absolute",
    right: RFValue(10),
    bottom: RFValue(60),
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
    text:{
      color:"#FFF",
    }
  },
  status: {
    borderRadius: RFValue(3),
    overflow: "hidden",
    text: {
      fontSize: RFValue(10),
      fontFamily: 'Poppins',
      color:"#FFF",
      paddingHorizontal: RFValue(10),
      paddingVertical: RFValue(2),
    },
    uploaded: {backgroundColor: colors.uploaded.color},
    completed: {backgroundColor: colors.completed.color},
    processing: {backgroundColor: colors.processing.color},
    fail: {backgroundColor: colors.fail.color},
  }
});
