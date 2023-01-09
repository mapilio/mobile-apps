import { RFValue } from "react-native-responsive-fontsize";
import {Dimensions} from "react-native";

export const panoStyle = {
  topBar: {
    zIndex: RFValue(1),
  },
  switch: {
    backgroundColor: "rgba(31,48,76,0.75)",
    padding: RFValue(5),
    borderRadius: RFValue(4),
    position: "absolute",
    left: RFValue(16),
  },
  minimize: {
    backgroundColor: "rgba(31,48,76,0.75)",
    padding: RFValue(4.5),
    borderRadius: RFValue(4),
    position: "absolute",
    top: RFValue(10),
    right: RFValue(16),
  },
  playWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: RFValue(13.19),
  },
  frameWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  frameText: {
    fontSize: RFValue(14),
    color: "#CBD1D9",
  },
  imageStyle: {
    // width: RFValue(Dimensions.get('window').width),
    // resizeMode: "cover",
    // aspectRatio: 3 / 2,
  },
  bottomTab: {
    paddingLeft: RFValue(13),
    paddingRight: RFValue(13),
    paddingTop: RFValue(6),
    paddingBottom: RFValue(6),
    backgroundColor: "#130C47",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    width: Dimensions.get("window").width,
    height: RFValue(30)
  },
  report: {
    flexDirection: "row",
    alignItems: "center",
  },
  reportText: {
    fontSize: RFValue(12),
    color: "#929BCC",
    marginLeft: RFValue(3.87),
    textDecorationLine: "underline",
  },
  capturerWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  capturerName: {
    color: "#B9C0CF",
    marginRight: RFValue(6.64),
    fontSize: RFValue(14),
    fontFamily: "Poppins-Medium",
    top: RFValue(1),
  },
  captureDate: {
    color: "#B9C0CF",
    fontSize: RFValue(12),
  },
  watermark: {
    position: "absolute",
    bottom: RFValue(43.01),
    left: RFValue(11.59),
  },
  userActionWrapper: {
    position: "absolute",
    bottom: RFValue(43),
    right: RFValue(17),
    zIndex: 1,
    alignItems: "center",
  },
  zoomIn: {
    backgroundColor: "rgba(31,48,76,0.75)",
    width: RFValue(19),
    height: RFValue(22),
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: RFValue(2),
    borderTopLeftRadius: RFValue(2),
  },
  zoomOut: {
    backgroundColor: "rgba(31,48,76,0.75)",
    width: RFValue(19),
    height: RFValue(22),
    justifyContent: "center",
    alignItems: "center",
    borderBottomRightRadius: RFValue(2),
    borderBottomLeftRadius: RFValue(2),
  },
  zoomWrapper: {
    marginBottom: RFValue(8),
  },
};
