import {StyleSheet} from "react-native";
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";

export const marketplaceStyles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    paddingHorizontal: RFValue(16),
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    borderTopRightRadius: RFValue(10),
    borderTopLeftRadius: RFValue(10),
  },
  panelHeader: {
    height: RFValue(30),
    alignItems: "center",
    justifyContent: "center",
  },
  listHeader: {
    marginBottom: RFValue(7.5),
    flexDirection: "row",
    alignItems: "center"
  },
  panel: {
    flex: 1,
    backgroundColor: "#130C47",
    position: "relative",
  },
  closeIcon: {
    backgroundColor: "#CBD1D9A2",
    position: "absolute",
    right: RFValue(30),
    top: RFValue(30),
    borderRadius: RFPercentage(50),
    zIndex: 10
  },
  title: {
    color: "#191919",
    fontFamily: "Poppins-Medium",
    fontSize: RFValue(18),
    marginLeft: RFValue(5),
    marginRight: RFValue(10)
  },
  popoverText: {
    paddingVertical: RFValue(5),
    paddingHorizontal: RFValue(10),
  },
});

export const marketplaceItemStyles = StyleSheet.create({
  container: {
    paddingVertical: RFValue(15),
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: RFValue(5),
  },
  owner: {
    color: "#191919",
    fontSize: RFValue(14),
  },
  job: {
    color: "#FFC231",
    fontSize: RFValue(12),
    fontWeight: "400",
  },
  title: {
    color: "#B9C0CF",
    fontSize: RFValue(14),
    fontWeight: "500",
    marginBottom: RFValue(15),
  },
  description: {
    color: "#808080",
    fontSize: RFValue(14),
    marginBottom: RFValue(5),
  },
  equipmentInfo: {
    color: "#808080",
    fontSize: RFValue(14),
    alignItems: "center",
    justifyContent: "center"
  },
  equipment: {
    color: "#191919",
    fontSize: RFValue(14),
  },
});

export const marketplaceDetailStyles = StyleSheet.create({
  marketplace_name: {
    color: "#C2C2C2",
    fontSize: RFValue(14),
  },
  owner: {
    color: "#191919",
    fontSize: RFValue(14),
    paddingVertical: RFValue(5)
  },
  description: {
    color: "#808080",
    fontSize: RFValue(14),
  },
  equipmentInfo: {
    color: "#808080",
    fontSize: RFValue(13)
  },
  equipment: {
    color: "#191919",
    fontSize: RFValue(13)
  },
  button: {
    backgroundColor: "#0056F1",
    paddingVertical: RFValue(10),
    marginTop: RFValue(24),
    borderRadius: RFValue(24),
    alignItems: "center"
  },
  buttonText: {
    color: "#FFF",
    fontSize: RFValue(14)
  }
});

export const marketplaceReceivedStyles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "auto",
    backgroundColor: "#FFF",
  },
  image: {
    height: RFValue(150),
    marginBottom: RFValue(35),
  },
  title: {
    color: "#191919",
    fontSize: RFValue(18),
    fontFamily: "Poppins-SemiBold",
  },
  description: {
    color: "#808080",
    fontSize: RFValue(14),
    lineHeight: RFValue(21),
    textAlign: "left",
    marginBottom: RFValue(22),
  },
  link: {
    color: "#0056F1",
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#0056F1",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: RFValue(20),
    paddingHorizontal: RFValue(25),
    paddingVertical: RFValue(13),
    borderRadius: RFValue(24),
    alignItems: "center",
    justifyContent: "center",
  },
  startCapture: {
    color: "#FFF",
    fontSize: RFValue(14),
  },
  or: {
    fontSize: RFValue(14),
    color: "#191919",
  },
  backToMarket:{
    color:"#191919",
    marginTop: RFValue(10),
  }
});
