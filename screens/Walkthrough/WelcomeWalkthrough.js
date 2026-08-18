import React, { useRef, useState } from 'react';
import { View, Image, SafeAreaView, StyleSheet, Platform } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Next, Skip } from '../../components/Walkthrough/WelcomeWalkthrough';
import { RFValue } from 'react-native-responsive-fontsize';
import { CustomText, CustomTextBold } from '../../highordercomponents';
import { useTranslation } from 'react-i18next';
import { FocusAwareStatusBar } from '../../components';
import { sliderData } from '../../util/consts/walkthrough/welcome';

const WelcomeWalkthrough = () => {
  const { t } = useTranslation('welcome_walkthrough');
  const [activeStep, setActiveStep] = useState(0);
  const pagerRef = useRef();

  const _renderItem = ({ item, index }) => {
    const isMoveOn = index === 3;

    const imageSource =
      index === 3 && Platform.isPad
        ? require('../../assets/images/walkthrough/moveon_tablet.png')
        : item.image;

    const resizeMode = isMoveOn && Platform.isPad ? 'stretch' : 'contain';

    return (
      <View key={index} style={{ flex: 1 }}>
        <Image
          style={{
            width: '100%',
            height: '70%',
            marginTop: 'auto',
            marginBottom: -30,
            resizeMode,
          }}
          source={imageSource}
        />
        <View style={styles.textWrapper}>
          <View style={styles.textContainer}>
            <CustomText style={styles.subTitle}>
              {t(item.subTitle)}{' '}
              {item.icons.map((source) => (
                <Image
                  key={source}
                  source={source}
                  style={{
                    width: RFValue(20),
                    height: RFValue(20),
                    resizeMode: 'contain',
                  }}
                />
              ))}
            </CustomText>
          </View>
          <CustomTextBold style={styles.title}>{t(item.title)}</CustomTextBold>
          <CustomText style={styles.desc} lineCount={10}>
            {t(item.desc)}
          </CustomText>
        </View>
      </View>
    );
  };

  const isLastStep = activeStep === sliderData.length - 1;

  return (
    <SafeAreaView style={styles.wrapper}>
      <FocusAwareStatusBar barStyle="dark-content" translucent={true} backgroundColor={'#fff'} />

      {!isLastStep && <Skip />}

      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => setActiveStep(e.nativeEvent.position)}>
        {sliderData.map((item, index) => _renderItem({ item, index }))}
      </PagerView>

      <View style={styles.sliderNavigation}>
        <View style={styles.dots}>
          {sliderData.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  width: i === activeStep ? RFValue(27) : RFValue(17),
                  backgroundColor: i === activeStep ? '#1976D2' : '#C0C0C0',
                },
              ]}
            />
          ))}
        </View>
        <Next
          activeStep={activeStep}
          dataLength={sliderData.length}
          onPress={() => pagerRef.current?.setPage(activeStep + 1)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pager: {
    width: '100%',
    height: '80%',
  },
  sliderNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '10%',
    justifyContent: 'space-between',
  },
  dots: {
    flexDirection: 'row',
    paddingLeft: RFValue(20),
    alignItems: 'center',
  },
  dot: {
    height: RFValue(4),
    borderRadius: RFValue(2),
    marginRight: RFValue(4),
  },
  textContainer: {
    marginBottom: RFValue(3),
    flexDirection: 'row',
    alignItems: 'center',
  },
  textWrapper: {
    paddingHorizontal: '5%',
    justifyContent: 'center',
  },
  title: {
    marginBottom: RFValue(5),
    fontSize: RFValue(28),
    color: '#191919',
  },
  subTitle: {
    fontSize: RFValue(16),
    color: '#808080',
  },
  desc: {
    fontSize: RFValue(14),
    color: '#808080',
    marginBottom: RFValue(40),
  },
});
export default WelcomeWalkthrough;
