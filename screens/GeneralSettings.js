import React, {useEffect} from "react";
import Slider from "@react-native-community/slider";
import {Platform, ScrollView, StatusBar, StyleSheet, View} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {IS_ACTIVE, UPDATE_DISTANCE_BETWEEN} from "../store/actionsName";
import {SettingsIcon} from "../assets/svg/illustrations";
import {convertHexToRGBA} from "../helper/helper";
import {CustomText, CustomTextMedium} from "../highordercomponents";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

const GeneralSettings = ({ navigation }) => {
  const dispatch = useDispatch();
  const {t} = useTranslation("camera_settings");
  const {distanceBetween} = useSelector((state) => state.settingsReducer);

  useEffect(() => {
    dispatch({type: IS_ACTIVE, payload: false})

    return () => {
      dispatch({type: IS_ACTIVE, payload: true})
    }
  }, []);

  const changeDistanceValue = (value) => dispatch({type: UPDATE_DISTANCE_BETWEEN, payload: value});

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      StatusBar.setHidden(true);
    });
    return () => unsubscribe();
  }, [navigation]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <SettingsIcon width={RFValue(21)} height={RFValue(21)} />
        <CustomText style={styles.title}>
          {t("general_settings")}
        </CustomText>
      </View>
      <View>
        <CustomTextMedium style={styles.subtitle}>
          {t("capture_settings")}
        </CustomTextMedium>
        <View style={styles.border} />
      </View>
      <ScrollView style={{ maxHeight: Platform.OS === "android" ? "100%" : "50%" }}>
        <View style={styles.item}>
          <CustomText style={{...styles.name, marginBottom: 4}}>
            {t("distance_between")}
          </CustomText>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ScrollView>
              <Slider
                style={{ width: "100%", height: RFValue(40) }}
                minimumValue={5}
                maximumValue={15}
                value={distanceBetween}
                step={1}
                onValueChange={changeDistanceValue}
                minimumTrackTintColor={"#007AFF"}
                maximumTrackTintColor={"#C7C7CC"}
                thumbTintColor={"#FFFFFF"}
              />
            </ScrollView>
            <CustomTextMedium style={{...styles.name, marginLeft: RFValue(7)}}>
              {distanceBetween} m
            </CustomTextMedium>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#2A2B2F",
    height: "100%",
    paddingBottom: RFValue(5)
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: RFValue(15),
    marginLeft: RFValue(38)
  },
  title: {
    fontSize: RFValue(17),
    color: "#B9C0CF",
    marginLeft: RFValue(7)
  },
  subtitle: {
    fontSize: RFValue(14),
    color: "#929BCC",
    marginLeft: RFValue(38),
    marginBottom: RFValue(6)
  },
  border: {
    marginLeft: RFValue(38),
    backgroundColor: convertHexToRGBA("#CBD1D9", 50),
    height: RFValue(2),
    width: "90%",
    marginBottom: RFValue(6)
  },
  item: {
    backgroundColor: "#333438",
    paddingHorizontal: RFValue(38),
    paddingVertical: RFValue(8)
  },
  name: {
    fontSize: RFValue(14),
    color: "#FFFFFF",
  }
})

export default GeneralSettings;
