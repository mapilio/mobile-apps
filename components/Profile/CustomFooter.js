import { BottomSheetFooter } from '@gorhom/bottom-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import { CustomText } from '../../highordercomponents';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const CustomFooter = ({ animatedFooterPosition, onPress, isBadgeSelected }) => {
  const {t} = useTranslation("profile");
  return (
    <BottomSheetFooter animatedFooterPosition={animatedFooterPosition} style={styles.footerWrapper}>
      <TouchableOpacity onPress={onPress} style={styles.closeButton}>
        <CustomText style={styles.buttonTitle}>
          {isBadgeSelected ? t("ok") : t("close")}</CustomText>
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
