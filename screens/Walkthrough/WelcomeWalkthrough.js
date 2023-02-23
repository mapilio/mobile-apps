import React, { useState } from "react";
import {
  Dimensions,
  View,
  Image,
  SafeAreaView,
  StyleSheet,
  Platform,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { Next, Skip } from "../../components/Walkthrough/WelcomeWalkthrough";
import { RFValue } from "react-native-responsive-fontsize";
import { CustomText, CustomTextBold } from "../../highordercomponents";
import { useTranslation } from "react-i18next";
import { FocusAwareStatusBar } from "../../components";
import { sliderData } from "../../util/consts/walkthrough/welcome";

const WelcomeWalkthrough = () => {
  const { t } = useTranslation("welcome_walkthrough");
  const width = Dimensions.get("window").width;
  const [activeStep, setActiveStep] = useState(0);

  const _renderItem = ({ item, index }) => {
    const isMoveOn = index === 3;

    const imageSource =
      index === 3 && Platform.isPad
        ? require("../../assets/images/walkthrough/moveon_tablet.png")
        : item.image;

    const resizeMode = isMoveOn && Platform.isPad ? "stretch" : "contain";

    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <Image
          style={{
            width: "100%",
            height: "70%",
            marginTop: "auto",
            resizeMode,
          }}
          source={imageSource}
        />
        <View style={styles.textWrapper}>
          <View style={styles.textContainer}>
            <CustomText style={styles.subTitle}>
              {t(item.subTitle)}{" "}
              {item.icons.map((source) => (
                <Image
                  key={source}
                  source={source}
                  style={{
                    width: RFValue(20),
                    height: RFValue(20),
                    resizeMode: "contain",
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
      <FocusAwareStatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor={"white"}
      />

      {!isLastStep && <Skip />}

      <Carousel
        ref={(c) => {
          this._carousel = c;
        }}
        data={sliderData}
        sliderWidth={width}
        itemWidth={width}
        renderItem={_renderItem}
        onSnapToItem={(index) => setActiveStep(index)}
        style={{
          height: "80%",
        }}
      />

      <View style={styles.sliderNavigation}>
        <Pagination
          containerStyle={{ paddingLeft: RFValue(20) }}
          dotsLength={sliderData.length}
          activeDotIndex={activeStep}
          dotStyle={{
            height: RFValue(4),
            width: RFValue(27),
            backgroundColor: "#1976D2",
          }}
          inactiveDotStyle={{ width: RFValue(17) }}
          inactiveDotScale={1}
        />
        <Next activeStep={activeStep} dataLength={sliderData.length} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  sliderNavigation: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: "10%",
    justifyContent: "space-between",
  },
  textContainer: {
    marginBottom: RFValue(3),
    flexDirection: "row",
    alignItems: "center",
  },
  textWrapper: {
    paddingHorizontal: "5%",
    justifyContent: "center",
  },
  title: {
    marginBottom: RFValue(5),
    fontSize: RFValue(28),
    color: "#191919",
  },
  subTitle: {
    fontSize: RFValue(16),
    color: "#808080",
  },
  desc: {
    fontSize: RFValue(14),
    color: "#808080",
    marginBottom: RFValue(40),
  },
});
export default WelcomeWalkthrough;
