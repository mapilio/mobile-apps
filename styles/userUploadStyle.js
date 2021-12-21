import {Dimensions, StyleSheet} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const userUploadStyles = StyleSheet.create({
  container: {
    paddingVertical: RFValue(35),
    paddingHorizontal: RFValue(16),
  },
  sequenceTitle: {
    fontSize: RFValue(18),
    color: "#4A4A4A",
  },
  sequenceDescription: {
    fontSize: RFValue(14),
    color: "#B9C0CF",
  },
  sequenceWrapper: {
    marginTop: RFValue(24),
    flexWrap: "wrap",
    flexDirection: "row",
  },
  textWhite: {
    color: '#FFF',
  },
  listItem: {
    backgroundColor: '#EDEFF1',
    flex: 1,
    marginBottom: 10,
  },
  backRightBtn: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: 75,
    backgroundColor: '#D33030',
    right: 0,
  },
  deleteButton: {
    backgroundColor: "#D33030",
    height: 45,
    width: 45,
    position: "absolute",
    right: 30,
    bottom: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 45
  }
});

export const userUploadModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4D4D4D'
  },
  text: {
    color: '#FFF',
    marginVertical: RFValue(5)
  },
  progressBar: {
    borderRadius: 4,
    width: Dimensions.get("window").width - RFValue(100)
  }
});