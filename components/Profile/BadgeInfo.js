import { StyleSheet, Image } from 'react-native';
import { CustomText, CustomTextBold } from '../../highordercomponents';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { RFValue } from 'react-native-responsive-fontsize';

const BadgeInfo = ({ badgeDetails }) => {
  return (
    <BottomSheetView style={styles.wrapper}>
      <Image source={{ uri: badgeDetails.icon }} style={styles.imageWrapper} />
      <CustomTextBold style={styles.title}>{badgeDetails?.title}</CustomTextBold>
      <CustomText style={styles.description}>{badgeDetails?.info}</CustomText>
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'white',
    flexDirection: 'column',
    paddingHorizontal: RFValue(20),
    paddingTop: RFValue(20),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  imageWrapper: { width: RFValue(100), height: RFValue(100), resizeMode: 'contain' },
  title: {
    textAlign: 'center',
    fontSize: RFValue(13),
    paddingVertical: RFValue(5),
  },
  description: {
    color: '#808080',
  },
});
export default BadgeInfo;
