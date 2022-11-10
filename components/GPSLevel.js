import React from "react";
import {StyleSheet, View} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {useSelector} from "react-redux";
import {BadGPS, GoodGPS} from "../assets/svg/illustrations";
import {CustomTextMedium} from "../highordercomponents";

const GPSLevel = () => {
  const {GPSAccuracy} = useSelector((state) => state.cameraReducer);

  return (
    <View style={styles.wrapper}>
      <View style={styles.gpsInfo}>
        {GPSAccuracy ? <GoodGPS/> : <BadGPS/>}
        <CustomTextMedium style={styles.statusText}>
          {GPSAccuracy ? 'Good GPS' : 'Bad GPS'}
        </CustomTextMedium>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderColor: "#FFF",
    borderRightWidth: 1.2,
    borderBottomWidth: 1.2,
    position: "relative",
    height: RFValue(55),
    width: RFValue(105)
  },
  gpsInfo: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: RFValue(10),
    right: RFValue(10),
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: RFValue(14),
    marginLeft: RFValue(5),
    marginBottom: RFValue(-2),
  }
})

export default GPSLevel;
