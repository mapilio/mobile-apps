import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const userUploadStyles = StyleSheet.create({
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
  }

});