import { ActivityIndicator, Animated, Image, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ProfileFeed from '../ProfileFeed';
import styles from './FeedList.styles';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../navigator/Routes';
import { api } from '../../util/helpers/api';
import { RFValue } from 'react-native-responsive-fontsize';
import { useRef } from 'react';
import UserInfos from '../UserInfos';
import { CustomText, CustomTextBold } from '../../highordercomponents';
import Badges from './Badges';
import EmptyComponent from './EmptyComponent';
import { captureException } from '@sentry/react-native';

const FeedList = ({ userDetails }) => {
  const { userInformation } = useSelector((state) => state.getTokenReducer);
  const { t } = useTranslation('profile');
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [gettingData, setGettingData] = useState(false);
  const [scoreDetails, setScoreDetails] = useState(null);
  const userid = userDetails?.id || userInformation?.id;

  const scrollY = useRef(new Animated.Value(0)).current;

  const opacityInterpolate = scrollY.interpolate({
    inputRange: [0, RFValue(200)],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const scaleSize = scrollY.interpolate({
    inputRange: [0, RFValue(200)],
    outputRange: [0, RFValue(35)],
    extrapolate: 'clamp',
  });

  const marginLeftScale = scrollY.interpolate({
    inputRange: [0, RFValue(200)],
    outputRange: [RFValue(0), RFValue(10)],
    extrapolate: 'clamp',
  });

  const getData = async () => {
    setGettingData(true);
    const url = `/api/user-uploads-v2?options[parameters][user_id]=${userid}&options[limit]=10&page=${page}`;

    try {
      const { data, pagination } = await api.get(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!!pagination) {
        setPage(pagination?.current_page + 1);
        setTotalPage(pagination?.last_page);
      }

      return { status: 'success', data, pagination };
    } catch (e) {
      throw new Error(e);
    }
  };

  const getScoreData = async () => {
    try {
      const scoreUrl = `/api/gamification/badges/${userid}`;
      const scoreData = await api.get(scoreUrl);
      setScoreDetails(scoreData);
    } catch (e) {
      captureException(e, {
        tags: {
          functionName: 'getScoreData',
        },
      });
    }
  };

  useEffect(() => {
    getData()
      .then(({ data }) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        captureException(err, {
          tags: {
            functionName: 'FeedList',
          },
        });
        toast.show(t('fetch_error'), { type: 'error' });
      })
      .finally(() => setGettingData(false));

    getScoreData();
  }, []);

  const nextPage = async () => {
    if (page > totalPage) return;
    setGettingData(true);

    getData()
      .then(({ data }) => setData((prev) => [...prev, ...data]))
      .catch(() => toast.show(t('fetch_error'), { type: 'error' }))
      .finally(() => setGettingData(false));
  };

  if (loading || !scoreDetails) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  const pressHandler = (group_key, start_address, capture_time) => {
    navigation.navigate(Routes.stackUserFeedDetail, {
      id: group_key,
      user_id: userid,
      start_address,
      capture_time,
    });
  };

  if (!userDetails && !userInformation) return null;

  const display_name = userDetails ? userDetails.username : userInformation?.display_name;

  const photoURL = userDetails
    ? userDetails.user_profile_photo
    : userInformation?.user_profile_photo;

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return parseInt(layoutMeasurement.height + contentOffset.y) == parseInt(contentSize.height);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Animated.Image
          style={{
            width: scaleSize,
            height: scaleSize,
            marginLeft: marginLeftScale,
            borderRadius: RFValue(20),
          }}
          source={{ uri: photoURL }}
        />
        <View style={styles.topBarContent}>
          <View style={{ flexDirection: 'row' }}>
            <CustomText style={styles.welcomeTitle}>
              {userDetails ? t('contributor') : t('hello')}
            </CustomText>
            <CustomTextBold style={styles.welcomeTitle}>{display_name}</CustomTextBold>
          </View>
          {!userDetails && (
            <CustomText style={styles.welcomeDesc}>
              {t('bar_desc')}
              <Image
                source={require('../../assets/images/walkthrough/party.png')}
                style={styles.topBarImage}
              />
            </CustomText>
          )}
        </View>
      </View>

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={(e) => {
          if (data?.length > 3) {
            Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
              useNativeDriver: false,
            })(e);
          }
          if (isCloseToBottom(e.nativeEvent) && data?.length > 0) {
            nextPage();
          }
        }}>
        <Animated.View
          style={[{ transform: [{ translateY: scaleSize }], opacity: opacityInterpolate }]}>
          <UserInfos userDetails={userDetails} scoreDetails={scoreDetails} />
        </Animated.View>

        {!userDetails && userInformation && <Badges badgeDetails={scoreDetails?.badges} />}

        <CustomTextBold style={styles.sectionTitle}>{t('feeds')}</CustomTextBold>

        {data?.length > 0 ? (
          data.map((item, index) => (
            <ProfileFeed
              key={index}
              data={item}
              pressHandle={() =>
                pressHandler(item.group_key, item.start_address, item.capture_time)
              }
            />
          ))
        ) : !userDetails ? (
          <EmptyComponent />
        ) : null}

        {gettingData && (
          <ActivityIndicator style={{ paddingVertical: RFValue(10) }} size={'small'} />
        )}
      </Animated.ScrollView>
    </View>
  );
};

export default FeedList;
