import React, { useEffect, useState } from "react";
import Slider from "@react-native-community/slider";
import { Platform, ScrollView, StatusBar, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { UPDATE_DISTANCE_BETWEEN } from "../store/actionsName";
import { InfoIcon, SettingsIcon } from "../assets/svg/illustrations";
import { convertHexToRGBA } from "../helper/helper";
import { CustomText, CustomTextMedium } from "../highordercomponents";
import { useDispatch, useSelector } from "react-redux";

const GeneralSettings = ({ navigation }) => {
  const dispatch = useDispatch();
  const { distanceBetween } = useSelector((state) => state.settingsReducer);
  const [sliderMeterValue, setSliderMeterValue] = useState(5);

  const changeDistanceValue = (value) => {
    setSliderMeterValue(value);
    dispatch({ type: UPDATE_DISTANCE_BETWEEN, payload: value });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", (e) => {
      StatusBar.setHidden(true);
      setSliderMeterValue(distanceBetween);
    });
    return () => unsubscribe();
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#2A2B2F",
        height: "100%",
        padddingBottom: RFValue(5),
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: RFValue(15),
          marginLeft: RFValue(38),
        }}
      >
        <SettingsIcon width={RFValue(21)} height={RFValue(21)} />
        <CustomText
          style={{
            fontSize: RFValue(17),
            color: "#B9C0CF",
            marginLeft: RFValue(7),
          }}
        >
          General settings
        </CustomText>
      </View>
      <View>
        <CustomTextMedium
          style={{
            fontSize: RFValue(14),
            color: "#929BCC",
            marginLeft: RFValue(38),
            marginBottom: RFValue(6),
          }}
        >
          Capture settings
        </CustomTextMedium>
        <View
          style={{
            marginLeft: RFValue(38),
            backgroundColor: convertHexToRGBA("#CBD1D9", 50),
            height: RFValue(2),
            width: "90%",
            marginBottom: RFValue(6),
          }}
        ></View>
      </View>
      <ScrollView
        style={{ maxHeight: Platform.OS === "android" ? "100%" : "50%" }}
      >
        <View
          style={{
            backgroundColor: "#333438",
            paddingHorizontal: RFValue(38),
            paddingVertical: RFValue(8),
          }}
        >
          <CustomText
            style={{
              fontSize: RFValue(14),
              color: "#FFFFFF",
              marginBottom: RFValue(4),
            }}
          >
            Distance between images
          </CustomText>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ScrollView>
              <Slider
                style={{ width: "100%", height: RFValue(40) }}
                minimumValue={5}
                maximumValue={15}
                value={sliderMeterValue}
                step={1}
                onValueChange={changeDistanceValue}
                minimumTrackTintColor={"#007AFF"}
                maximumTrackTintColor={"#C7C7CC"}
                thumbTintColor={"#FFFFFF"}
              />
            </ScrollView>
            <CustomTextMedium
              style={{
                fontSize: RFValue(14),
                color: "#FFFFFF",
                marginLeft: RFValue(7),
              }}
            >
              {sliderMeterValue} m
            </CustomTextMedium>
          </View>
        </View>
        {/* <View
          style={{
            paddingHorizontal: RFValue(38),
            paddingVertical: RFValue(8),
          }}
        >
          <CustomText
            style={{
              fontSize: RFValue(14),
              color: "#FFFFFF",
              marginBottom: RFValue(4),
            }}
          >
            Display interval (default 1 second)
          </CustomText>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ScrollView scrollEnabled={scrollEnabled}>
              <MultiSlider
                onValuesChangeStart={disableScroll}
                onValuesChangeFinish={enableScroll}
                containerStyle={{
                  marginLeft:
                    Platform.OS === "android" ? RFValue(8) : RFValue(11),
                }}
                isMarkersSeparated={true}
                markerStyle={{
                  backgroundColor: "#FFFFFF",
                }}
                selectedStyle={{
                  backgroundColor: "#007AFF",
                  height: RFValue(2),
                }}
                min={1}
                max={5}
                values={[2]}
                sliderLength={RFValue(530)}
                onValuesChange={(value) => setSliderSecondValue(value)}
              />
            </ScrollView>
            <CustomTextMedium
              style={{
                fontSize: RFValue(14),
                color: "#FFFFFF",
              }}
            >
              {sliderSecondValue}.0 sn
            </CustomTextMedium>
          </View>
        </View> */}
        {/* <View
          style={{
            paddingHorizontal: RFValue(38),
            paddingVertical: RFValue(8),
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CustomText
            style={{
              fontSize: RFValue(14),
              color: "#FFFFFF",
            }}
          >
            Stop rendering at low speed
          </CustomText>
          <Switch
            onValueChange={toggleSwitch}
            value={switchToggle}
            trackColor={{ true: "#1AD971", false: "#FFFFFF" }}
            thumbColor={"#FFFFFF"}
          />
        </View> */}
      </ScrollView>
      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          position: "absolute",
          right: RFValue(30),
          bottom: RFValue(10),
        }}
      >
        <CustomTextMedium
          style={{
            fontSize: RFValue(14),
            color: "#4A90E2",
            marginRight: RFValue(6),
          }}
        >
          Help
        </CustomTextMedium>
        <InfoIcon />
      </View> */}
    </View>
  );
};

export default GeneralSettings;
