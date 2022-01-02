import {Dimensions, StyleSheet} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";

const windowWidth = Dimensions.get("window").width;

export const marketplaceStyles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    paddingHorizontal: RFValue(16),
    backgroundColor: '#32425B',
    overflow: "hidden",
    borderTopRightRadius: RFValue(10),
    borderTopLeftRadius: RFValue(10),
  },
  panelHeader: {
    height: RFValue(30),
    backgroundColor: '#32425B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listHeader: {
    borderBottomWidth: RFValue(1),
    borderBottomColor: '#CBD1D9',
    marginBottom: RFValue(7.5),
    flexDirection: "row",
    justifyContent:"space-between"
  },
  panel: {
    flex: 1,
    backgroundColor: '#32425B',
    position: 'relative',
  },
  title: {
    color: '#FFF',
    fontWeight: "500",
    fontSize: RFValue(16),
    marginRight: RFValue(10),
  },
  popoverText: {
    paddingVertical: RFValue(5),
    paddingHorizontal: RFValue(10),
  }
});

export const marketplaceItemStyles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: '#576679FF',
    marginBottom: RFValue(15),
    paddingVertical: RFValue(15),
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: RFValue(5)
  },
  owner: {
    color: "#4A90E2",
    fontSize: RFValue(16),
    fontWeight: "400"
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
    color: "#FFF",
    fontSize: RFValue(14),
    marginBottom: RFValue(5)
  },
  equipment: {
    color: "#FFF",
    fontSize: RFValue(14)
  }
});

export const marketplaceDetailStyles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFF'},
  primaryText: {color: "#4A4A4A"},
  secondaryTextColor: {color: '#A0AABE'},
  blueTextColor: {color: '#3D90DD'},
  smallText: {fontSize: RFValue(12)},
  title: {
    fontSize: RFValue(18),
    color: '#32425B',
  },
  imageArea: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFValue(20),
    marginBottom: RFValue(30),
  },
  image: {
    width: RFValue((windowWidth / 2) - 40),
    height: RFValue(115),
  },
  bottomSection: {
    backgroundColor: '#FBFBFD',
    paddingVertical: RFValue(15),
    borderTopWidth: RFValue(1),
    borderColor: '#d9dbe1',
    justifyContent: "center",
  },
  captureZoneText: {
    marginBottom: RFValue(20),
    fontSize: RFValue(14),
    textAlign: "center",
  },
  button: {
    backgroundColor: '#1AD971',
    marginLeft: "auto",
    marginRight: "auto",
    paddingHorizontal: RFValue(25),
    paddingVertical: RFValue(6),
    fontSize: RFValue(12),
    color: '#FFF',
    borderRadius: RFValue(15),
    height: RFValue(30),
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export const marketplaceReceivedStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    marginHorizontal: RFValue(40),
  },
  image: {
    height: RFValue(150),
    marginBottom: RFValue(35),
  },
  title: {
    color: '#000',
    fontSize: RFValue(18),
  },
  description: {
    color: '#4A4A4A',
    fontSize: RFValue(14),
    lineHeight: RFValue(21),
    textAlign: 'center',
    marginBottom: RFValue(22),
  },
  link: {
    color: '#00D878',
    textDecorationLine: 'underline',
  }
});
