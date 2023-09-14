import { Image, TouchableOpacity, View } from 'react-native';
import { CustomText, CustomTextBold, CustomTextMedium } from '../highordercomponents';
import { useSelector } from 'react-redux';
import { RFValue, RFPercentage } from 'react-native-responsive-fontsize';

import AnimatedCircle from './AnimatedCircle';
import {
  CameraFilledIcon,
  ProfileBackground,
  RoadIcon,
  OpenStreetMap,
} from '../assets/svg/illustrations';
import { thousandFormatter } from '../helper/helper';
import { StyleSheet } from 'react-native';

const UserInfos = ({ userDetails }) => {
  const { userInformation } = useSelector((state) => state.getTokenReducer);

  if (!userInformation && !userDetails) return null;

  const photoURL = userDetails
    ? userDetails.user_profile_photo
    : userInformation.user_profile_photo;
  const photos = userDetails ? userDetails.photos : userInformation.photos;
  const roads = userDetails ? userDetails.km : userInformation.meters;

  return (
    <View style={styles.profileContainer}>
      <ProfileBackground />
      <View style={styles.profileImageWrapper}>
        <Image style={styles.profileImage} source={{ uri: photoURL }} />
        <AnimatedCircle value={90} width={RFValue(85)} height={RFValue(85)} />
      </View>

      <View style={styles.scoreWrapper}>
        <CustomText style={styles.scoreText}>Score</CustomText>
        <CustomTextBold style={styles.pointsText}>850 pts</CustomTextBold>
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
          {'km'}
        </CustomTextMedium>
        </View>
      </View>

      <View style={styles.socialWrapper}>
        <View style={styles.rankWrapper}>
          <CustomText style={styles.rankTitle}>Leaderboard Rank</CustomText>
          <CustomTextBold style={styles.rankDesc}>#12</CustomTextBold>
        </View>

        <View style={styles.osmWrapper}>
          <OpenStreetMap fill="#808080" width={RFValue(16)} />
          <TouchableOpacity onPress={() => {}} style={styles.osmButton}>
            <CustomText style={styles.osmText}>OSM Profile</CustomText>
          </TouchableOpacity>
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
    height: RFValue(90),
  },
  profileImage: {
    borderRadius: RFPercentage(50),
    resizeMode: 'cover',
    width: RFValue(65),
    height: RFValue(65),
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
    width: '60%',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: RFValue(3),
  },
  statsBlock:{
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
  socialWrapper: {
    marginTop: RFValue(10),
    width: '85%',
  },
  rankWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RFValue(10),
  },
  osmWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  osmButton: {
    borderWidth: RFValue(1),
    width: RFValue(80),
    alignItems: 'center',
    padding: RFValue(3),
    borderRadius: RFValue(10),
    borderColor: '#C2C2C2',
    backgroundColor: 'white',
  },
  osmText: {
    fontSize: RFValue(10),
    color: '#000000',
  },
  rankTitle: { fontSize: RFValue(13), color: '#666666' },
  rankDesc: { fontSize: RFValue(13), color: '#000000' },
});

export default UserInfos;
