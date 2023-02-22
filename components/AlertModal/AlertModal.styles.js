import {Dimensions, StyleSheet} from "react-native";
import {globalStyles} from "../../styles/globalStyles";
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";

const {width} = Dimensions.get('window')

export default StyleSheet.create({
  deleteModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  deleteModalContent: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: RFValue(70),
    borderRadius: RFValue(10),
    width: width * .9,
    alignSelf: 'center',
    alignItems: 'center',
    padding: RFValue(20),
    ...globalStyles.shadow,
  },
  trashIcon: {
    width: RFValue(40),
    height: RFValue(40),
    backgroundColor: '#D33030',
    borderRadius: RFValue(40),
    marginBottom: RFValue(5),
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteModalTitle:{
    color: '#191919',
    fontSize: RFValue(18),
    fontFamily: 'Poppins-SemiBold',
    marginVertical: RFValue(5),
  },
  deleteModalDescription: {
    color: '#808080',
    fontSize: RFValue(12),
    fontFamily: 'Poppins',
  },
  actions: {
    flexDirection: 'row',
    marginTop: RFValue(20),
  },
  actionsButton: {
    borderWidth: 1,
    borderColor: '#666666',
    borderRadius: RFPercentage(50),
    flex: 1,
    paddingVertical: RFValue(10),
    marginHorizontal: RFValue(5),
  },
  actionsButtonText: {
    alignSelf: 'center',
    color: '#333333',
    fontSize: RFValue(12),
    fontFamily: 'Poppins',
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#666666',
  },
  deleteButtonText: {
    color: '#fff',
  }
});
