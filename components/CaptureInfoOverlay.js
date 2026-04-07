import React from "react";
import {StyleSheet, View} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {useSelector} from "react-redux";
import {CustomText, CustomTextBold} from "../highordercomponents";
import {useTranslation} from "react-i18next";

const CaptureInfoOverlay = () => {
  const {cameraLocation, photoAmount} = useSelector((state) => state.cameraReducer);
  const {autoCaptureStart, distanceBetween} = useSelector((state) => state.settingsReducer);
  const {t} = useTranslation("camera");

  if (!autoCaptureStart) return null;

  const accuracy = cameraLocation?.accuracy?.toFixed(1) ?? "--";
  const speed = cameraLocation?.speed > 0
    ? (cameraLocation.speed * 3.6).toFixed(0)
    : "0";

  const accuracyColor = cameraLocation?.accuracy <= 10
    ? "#38B35A"
    : cameraLocation?.accuracy <= 25
      ? "#FBA63C"
      : "#EC4E2C";

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.dot, {backgroundColor: accuracyColor}]}/>
        <CustomText style={styles.label}>GPS</CustomText>
        <CustomTextBold style={styles.value}>{accuracy}m</CustomTextBold>
      </View>

      <View style={styles.separator}/>

      <View style={styles.row}>
        <CustomText style={styles.label}>{t("speed") || "Speed"}</CustomText>
        <CustomTextBold style={styles.value}>{speed} km/h</CustomTextBold>
      </View>

      <View style={styles.separator}/>

      <View style={styles.row}>
        <CustomText style={styles.label}>{t("photos") || "Photos"}</CustomText>
        <CustomTextBold style={styles.value}>{photoAmount}</CustomTextBold>
      </View>

      <View style={styles.separator}/>

      <View style={styles.row}>
        <CustomText style={styles.label}>{t("interval") || "Interval"}</CustomText>
        <CustomTextBold style={styles.value}>{distanceBetween}m</CustomTextBold>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: RFValue(12),
    left: RFValue(12),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: RFValue(8),
    paddingHorizontal: RFValue(10),
    paddingVertical: RFValue(6),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: RFValue(6),
    height: RFValue(6),
    borderRadius: RFValue(3),
    marginRight: RFValue(4),
  },
  label: {
    color: "#AAAAAA",
    fontSize: RFValue(10),
    marginRight: RFValue(4),
  },
  value: {
    color: "#FFFFFF",
    fontSize: RFValue(11),
  },
  separator: {
    width: 1,
    height: RFValue(14),
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: RFValue(8),
  },
});

export default CaptureInfoOverlay;
