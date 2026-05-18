import { Image, View } from 'react-native';
import { CustomText, CustomTextBold, CustomTextMedium } from '../highordercomponents';
import { useSelector } from 'react-redux';
import { RFValue, RFPercentage } from 'react-native-responsive-fontsize';

import AnimatedCircle from './AnimatedCircle';
import { CameraFilledIcon, ProfileBackground, RoadIcon } from '../assets/svg/illustrations';
import { thousandFormatter } from '../helper/helper';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const UserInfos = ({ userDetails, scoreDetails }) => {
  const { userInformation } = useSelector((state) => state.getTokenReducer);
  const { t } = useTranslation('profile');

  if (!userInformation && !userDetails) return null;

  const photoURL = userDetails
    ? userDetails.user_profile_photo
    : userInformation.user_profile_photo;
  const photos = userDetails ? userDetails.photos : userInformation.photos;
  const roads = userDetails ? userDetails.km : userInformation.meters;
  const scorePercent = scoreDetails?.next?.percentage;
  const percentColor = scoreDetails?.next?.badge?.color_code;

  return (
    <View style={styles.profileContainer}>
      <ProfileBackground />
      <View style={styles.profileImageWrapper}>
        <Image style={styles.profileImage} source={{ uri: photoURL }} />
        <AnimatedCircle
          value={scorePercent > 100 ? 100 : scorePercent}
          width={RFValue(105)}
          height={RFValue(105)}
          color={percentColor}
        />
        <Image style={styles.badgeIcon} source={{ uri: scoreDetails?.next?.badge?.icon }} />
      </View>

      <View style={styles.scoreWrapper}>
        <CustomText style={styles.scoreText}>{t('score')}</CustomText>
        <CustomTextBold style={styles.pointsText}>{scoreDetails?.point}</CustomTextBold>
      </View>

      <View style={styles.statsWrapper}>
        <View style={styles.statsBlock}>
          <CameraFilledIcon fill="#808080" width={RFValue(16)} />
          <CustomTextMedium style={styles.statsText}>{thousandFormatter(photos)}</CustomTextMedium>
        </View>

        <View style={styles.verticalSeperator} />

        <View style={styles.statsBlock}>
          <RoadIcon fill="#808080" width={RFValue(16)} />
          <CustomTextMedium style={styles.statsText}>
            {thousandFormatter(roads, 'k')}
            {' km'}
          </CustomTextMedium>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: RFValue(5),
    alignItems: 'center',
  },
  profileImageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: RFValue(110),
    width: RFValue(135),
  },
  profileImage: {
    borderRadius: RFPercentage(50),
    resizeMode: 'cover',
    width: RFValue(85),
    height: RFValue(85),
  },
  badgeIcon: {
    position: 'absolute',
    resizeMode: 'contain',
    width: RFValue(45),
    height: RFValue(45),
    bottom: RFValue(15),
    right: 0,
  },
  scoreWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: RFValue(12),
    color: '#666666',
  },
  pointsText: {
    fontSize: RFValue(17),
    marginLeft: RFValue(10),
    color: '#000000',
  },
  statsWrapper: {
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: RFValue(3),
  },
  statsBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: RFValue(14),
    marginLeft: RFValue(5),
    color: '#000000',
  },
  verticalSeperator: {
    width: 1,
    height: '80%',
    backgroundColor: '#DCDCDC',
    marginHorizontal: 10,
  },
});

export default UserInfos;
