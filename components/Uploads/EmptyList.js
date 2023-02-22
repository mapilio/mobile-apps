import {Animated, Dimensions, Easing, ImageBackground, Text, View} from "react-native";
import {NoUpload} from "../../assets/svg/illustrations";
import styles from "./EmptyList.styles";
import {useTranslation} from "react-i18next";
import Carousel, {Pagination} from "react-native-snap-carousel";
import {getContentAreaHeight} from "../../helper/helper";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {RFValue} from "react-native-responsive-fontsize";
import {useEffect, useRef, useState} from "react";
import LinearGradient from "react-native-linear-gradient";
import {tabHeight} from "../../util/consts/ui";

const EmptyList = () => {
  const {t} = useTranslation("upload");
  const {width} = Dimensions.get("window");
  const {top, bottom} = useSafeAreaInsets();
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef();

  const carousel = [
    {
      title: t('accessible_world.title'),
      description: t('accessible_world.description'),
      image: require('../../assets/images/accessibleWorld.png')
    },
    {
      title: t('contribute_to_our_environment.title'),
      description: t('contribute_to_our_environment.description'),
      image: require('../../assets/images/contributeEnvironment.png')
    },
    {
      title: t('traffic_problem.title'),
      description: t('traffic_problem.description'),
      image: require('../../assets/images/trafficProblem.png')
    },
    {
      title: t('earthquakes_and_emergencies.title'),
      description: t('earthquakes_and_emergencies.description'),
      image: require('../../assets/images/emergencies.png')
    },
  ];

  const _renderItem = ({item}) => {
    return (
      <View style={styles.slideItem}>
        <ImageBackground
          source={item.image}
          resizeMode={'cover'}
          borderRadius={RFValue(8)}
        >
          <LinearGradient colors={['#00000099', '#00000033']} style={styles.slideGradient}>
            <Text style={styles.slideTitle}>{t(`${item.title}`)}</Text>
            <Text style={styles.slideDescription}>{t(item.description)}</Text>
          </LinearGradient>
        </ImageBackground>
      </View>
    )
  }

  const ActiveDot = () => {
    const Default = useRef(new Animated.Value(0)).current;
    const Active = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(Active, {toValue: 1, duration: 3000, useNativeDriver: false, easing: Easing.ease}).start();
      Animated.timing(Default, {toValue: 1, duration: 200, useNativeDriver: false, easing: Easing.ease}).start();
    }, [Active, Default]);

    const defaultDotWidth = Default.interpolate({inputRange: [0, 1], outputRange: [RFValue(10), RFValue(24)]})
    const activeDotWidth = Active.interpolate({inputRange: [0, 1], outputRange: ['0%', '100%']})


    return (
      <Animated.View style={{...styles.dotStyle, width: defaultDotWidth, overflow: 'hidden'}}>
        <Animated.View style={{...styles.dotStyleActive, width: activeDotWidth}}/>
      </Animated.View>
    )
  }

  return (
    <View style={{...styles.wrapper, height: getContentAreaHeight(top, bottom + tabHeight)}}>
      <View style={styles.container}>
        <NoUpload />
        <Text style={styles.noFeedTitle}>{t("no_data.title")}</Text>
        <Text style={styles.noFeedDescription}>{t("no_data.description")}</Text>
      </View>

      <View>
        <Carousel
          ref={carouselRef}
          sliderWidth={width}
          itemWidth={width}
          data={carousel}
          renderItem={_renderItem}
          loop={true}
          autoplay={true}
          autoplayInterval={3000}
          onSnapToItem={setActiveSlide}
          activeAnimationType={'spring'}
        />

        <Pagination
          activeDotIndex={activeSlide}
          dotsLength={carousel.length}
          dotStyle={styles.dotStyle}
          inactiveDotStyle={styles.inactiveDotStyle}
          inactiveDotOpacity={1}
          inactiveDotElement={<View style={styles.inactiveDotStyle} />}
          dotElement={<ActiveDot />}
          containerStyle={styles.paginationContainer}
        />
      </View>
    </View>
  );
}

export default EmptyList;
