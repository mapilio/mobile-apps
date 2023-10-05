import { BottomSheetFooter } from '@gorhom/bottom-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import { CustomText } from '../../highordercomponents';
import { StyleSheet } from 'react-native';

const CustomFooter = ({ animatedFooterPosition, onPress, isBadgeSelected }) => {
  return (
    <BottomSheetFooter animatedFooterPosition={animatedFooterPosition} style={styles.footerWrapper}>
      <TouchableOpacity onPress={onPress} style={styles.closeButton}>
        <CustomText style={styles.buttonTitle}>
          {isBadgeSelected ? "Ok" : "Close"}</CustomText>
      </TouchableOpacity>
    </BottomSheetFooter>
  );
};

const styles = StyleSheet.create({
  footerWrapper: {
    height: RFValue(60),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#0056F1',
    width: RFValue(250),
    height: RFValue(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(20),
  },
  buttonTitle:{ fontSize: RFValue(13), color: 'white' }
});
export default CustomFooter;
