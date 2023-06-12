import { Fragment, useEffect, useState } from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  IS_ACTIVE,
  UPDATE_DISTANCE_BETWEEN,
  UPDATE_LOW_RESOLUTION,
} from "../store/actionsName";
import { CustomText, CustomTextMedium } from "../highordercomponents";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Slider } from "@miblanchard/react-native-slider";
import { Snackbar, Switch } from "react-native-paper";

const GeneralSettings = ({ navigation }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation("camera_settings");
  const { distanceBetween, lowResolution } = useSelector(
    (state) => state.settingsReducer
  );
  const { photoAmount, batteryLevel, phoneMemory } = useSelector(
    (state) => state.cameraReducer
  );
  const [showSnackbar, setShowSnackbar] = useState(false);

  const { left, right } = useSafeAreaInsets();

  useEffect(() => {
    dispatch({ type: IS_ACTIVE, payload: false });
    return () => {
      dispatch({ type: IS_ACTIVE, payload: true });
    };
  }, []);

  const changeDistanceValue = (value) => {
    if (distanceBetween !== value[0]) {
      dispatch({ type: UPDATE_DISTANCE_BETWEEN, payload: value[0] });
    }
  };

  const onToggleSwitch = () => {
    setShowSnackbar(true);
    dispatch({ type: UPDATE_LOW_RESOLUTION, payload: !lowResolution });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      StatusBar.setHidden(true);
    });
    return () => unsubscribe();
  }, [navigation]);

  const safeAreaPaddings = {
    paddingLeft: left ? left : RFValue(35),
    paddingRight: right ? right : RFValue(35),
  };

  return (
    <View style={styles.wrapper}>
      <Snackbar
        visible={showSnackbar}
        duration={3000}
        onDismiss={() => {
          setShowSnackbar(false);
        }}
        wrapperStyle={{
          zIndex: 2,
        }}
        action={{
          label: t("ok"),
          color: "#fff",
        }}
      >
        {t("settings_saved")}
      </Snackbar>

      <View style={styles.item}>
        <View style={safeAreaPaddings}>
          <CustomText style={styles.itemMenuTitle}>
            {t("camera_settings")}
          </CustomText>
          <CustomText style={styles.itemTitle}>
            {t("distance_between")}
          </CustomText>
          <View style={styles.row}>
            <Slider
              minimumValue={5}
              maximumValue={15}
              step={1}
              value={distanceBetween}
              onValueChange={changeDistanceValue}
              containerStyle={{ width: "90%" }}
              minimumTrackTintColor={"#3F8BE9"}
              maximumTrackTintColor={"#C7C7CC"}
              thumbStyle={styles.thumbStyle}
            />
            <CustomTextMedium
              style={{ ...styles.itemDesc, marginLeft: RFValue(13) }}
            >
              {distanceBetween} m
            </CustomTextMedium>
          </View>
          {Platform.OS === "ios" && (
            <Fragment>
              <View style={styles.seperator} />
              <View style={styles.row}>
                <View style={{ flexDirection: "column" }}>
                  <CustomText style={styles.itemTitle}>
                    {t("enable_low_resolution")}
                  </CustomText>
                  <CustomText style={{ color: "grey" }}>
                    {t("enable_low_resolution_desc")}
                  </CustomText>
                </View>
                <Switch
                  value={lowResolution}
                  onChange={onToggleSwitch}
                  color="#0056F1"
                />
              </View>
            </Fragment>
          )}
        </View>
      </View>
      <View style={styles.padding} />

      <View style={styles.item}>
        <View style={safeAreaPaddings}>
          <CustomText style={styles.itemMenuTitle}>
            {t("capture_settings")}
          </CustomText>
          <View style={styles.row}>
            <CustomText style={styles.itemTitle}>
              {t("remaining_images")}
            </CustomText>
            <View style={styles.row}>
              <CustomTextMedium
                style={{ ...styles.itemDesc, color: "#3F8BE9" }}
              >
                {photoAmount}{" "}
              </CustomTextMedium>
              <CustomTextMedium style={styles.itemDesc}>
                / {phoneMemory}
              </CustomTextMedium>
            </View>
          </View>
          <View style={styles.seperator} />
          <View style={styles.row}>
            <CustomText style={styles.itemTitle}>
              {t("battery_level")}
            </CustomText>
            <CustomText style={styles.itemDesc}>%{batteryLevel}</CustomText>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  itemMenuTitle: {
    fontSize: RFValue(12),
    color: "#666666",
    marginBottom: RFValue(6),
    fontFamily: "Poppins-Medium",
  },
  seperator: {
    height: RFValue(2),
    backgroundColor: "#EAEAEA",
    marginVertical: RFValue(4),
  },
  padding: {
    marginVertical: RFValue(5),
  },
  item: {
    backgroundColor: "#F7F7F7",
    paddingVertical: RFValue(8),
  },
  itemDesc: {
    fontSize: RFValue(15),
    color: "#333333",
    fontFamily: "Poppins-Medium",
  },
  itemTitle: {
    fontSize: RFValue(14),
    color: "#333333",
    fontFamily: "Poppins-Medium",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: RFValue(2),
  },
  thumbStyle: {
    width: RFValue(18),
    height: RFValue(18),
    borderRadius: RFValue(9),
    backgroundColor: "#3F8BE9",
    borderColor: "#FFFFFF",
    borderWidth: RFValue(2),
  },
});

export default GeneralSettings;
