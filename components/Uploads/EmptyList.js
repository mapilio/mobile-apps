import { Animated, Dimensions, Easing, ImageBackground, Text, View } from 'react-native';
import { NoUpload } from '../../assets/svg/illustrations';
import styles from './EmptyList.styles';
import { useTranslation } from 'react-i18next';
import PagerView from 'react-native-pager-view';
import { getContentAreaHeight } from '../../helper/helper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { useEffect, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { tabHeight } from '../../util/consts/ui';

const AUTOPLAY_INTERVAL = 3000;

const EmptyList = () => {
  const { t } = useTranslation('upload');
  const { width } = Dimensions.get('window');
  const { top, bottom } = useSafeAreaInsets();
  const [activeSlide, setActiveSlide] = useState(0);
  const pagerRef = useRef();

  const carousel = [
    {
      title: t('accessible_world.title'),
      description: t('accessible_world.description'),
      image: require('../../assets/images/accessibleWorld.png'),
    },
    {
      title: t('contribute_to_our_environment.title'),
      description: t('contribute_to_our_environment.description'),
      image: require('../../assets/images/contributeEnvironment.png'),
    },
    {
      title: t('traffic_problem.title'),
      description: t('traffic_problem.description'),
      image: require('../../assets/images/trafficProblem.png'),
    },
    {
      title: t('earthquakes_and_emergencies.title'),
      description: t('earthquakes_and_emergencies.description'),
      image: require('../../assets/images/emergencies.png'),
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = (activeSlide + 1) % carousel.length;
      pagerRef.current?.setPage(next);
    }, AUTOPLAY_INTERVAL);
    return () => clearTimeout(timer);
  }, [activeSlide]);

  const _renderItem = ({ item }) => {
    return (
      <View style={styles.slideItem}>
        <ImageBackground source={item.image} resizeMode={'cover'} borderRadius={RFValue(8)}>
          <LinearGradient colors={['#00000099', '#00000033']} style={styles.slideGradient}>
            <Text style={styles.slideTitle}>{t(`${item.title}`)}</Text>
            <Text style={styles.slideDescription}>{t(item.description)}</Text>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  };

  const ActiveDot = () => {
    const Default = useRef(new Animated.Value(0)).current;
    const Active = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(Active, {
        toValue: 1,
        duration: AUTOPLAY_INTERVAL,
        useNativeDriver: false,
        easing: Easing.ease,
      }).start();
      Animated.timing(Default, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
        easing: Easing.ease,
      }).start();
    }, [Active, Default]);

    const defaultDotWidth = Default.interpolate({
      inputRange: [0, 1],
      outputRange: [RFValue(10), RFValue(24)],
    });
    const activeDotWidth = Active.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

    return (
      <Animated.View style={{ ...styles.dotStyle, width: defaultDotWidth, overflow: 'hidden' }}>
        <Animated.View style={{ ...styles.dotStyleActive, width: activeDotWidth }} />
      </Animated.View>
    );
  };

  return (
    <View style={{ ...styles.wrapper, height: getContentAreaHeight(top, bottom + tabHeight) }}>
      <View style={styles.container}>
        <NoUpload />
        <Text style={styles.noFeedTitle}>{t('no_data.title')}</Text>
        <Text style={styles.noFeedDescription}>{t('no_data.description')}</Text>
      </View>

      <View>
        <PagerView
          ref={pagerRef}
          style={{ width, height: RFValue(140) }}
          initialPage={0}
          onPageSelected={(e) => setActiveSlide(e.nativeEvent.position)}>
          {carousel.map((item, index) => (
            <View key={index}>{_renderItem({ item })}</View>
          ))}
        </PagerView>

        <View
          style={[
            styles.paginationContainer,
            { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
          ]}>
          {carousel.map((_, i) =>
            i === activeSlide ? (
              <ActiveDot key={i} />
            ) : (
              <View key={i} style={styles.inactiveDotStyle} />
            )
          )}
        </View>
      </View>
    </View>
  );
};

export default EmptyList;
