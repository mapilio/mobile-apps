import { RFValue } from "react-native-responsive-fontsize";
import { Dimensions } from "react-native";

export const panoStyle = {
  topBar: {
    zIndex: RFValue(1),
  },
  switch: {
    backgroundColor: "#191919",
    borderRadius: RFValue(4),
    position: "absolute",
    left: RFValue(16),
    opacity: 0.7,
    padding: RFValue(4.5),
  },
  minimize: {
    backgroundColor: "#191919",
    opacity: 0.7,
    padding: RFValue(4.5),
    borderRadius: RFValue(20),
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
  bottomTab: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    position: "absolute",
    bottom: 0,
    width: Dimensions.get("window").width,
    height: RFValue(100),
  },
  report: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: RFValue(10),
    position: "absolute",
    right: RFValue(10),
    bottom: RFValue(0),
  },
  reportText: {
    fontSize: RFValue(12),
    color: "#929BCC",
    marginLeft: RFValue(3.87),
    textDecorationLine: "underline",
  },
  watermark: {
    position: "absolute",
    bottom: RFValue(10),
    left: RFValue(10),
  },
  info: {
    position: "absolute",
    bottom: RFValue(40),
    zIndex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    flexDirection: "row",
    paddingRight: RFValue(10),
  },
  capturer: {
    name: {
      color: "#F4F2F6",
      marginLeft: RFValue(10),
      fontSize: RFValue(11.5),
      fontFamily: "Poppins-Medium",
    },
    date: {
      color: "#D8D8D8",
      fontSize: RFValue(11.5),
      paddingLeft: RFValue(8),
    },
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
