import React from "react";
import {StyleSheet, View} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {useSelector} from "react-redux";
import {CustomTextMedium} from "../highordercomponents";
import Lottie from "lottie-react-native";

const GPSLevel = () => {
  const {GPSAccuracy} = useSelector((state) => state.cameraReducer);

  return (
      <View style={styles.gpsInfo}>
        <View style={{position:"absolute",  transform: [{
            translateX: RFValue(-5)
          }]}} >
        {GPSAccuracy ? <Lottie source={require("../assets/animations/goodGps.json")} autoPlay loop={false}  style={{
          width: RFValue(40),
          height: RFValue(40),
        }} /> : <Lottie source={require("../assets/animations/badGps.json")} autoPlay loop style={{
          width: RFValue(40),
          height: RFValue(40),
        }} />}
        </View>
        <CustomTextMedium style={styles.statusText}>
          {GPSAccuracy ? 'Good GPS' : 'Bad GPS'}
        </CustomTextMedium>
      </View>
  );
};

const styles = StyleSheet.create({
  gpsInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: RFValue(10),
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: RFValue(14),
    marginLeft: RFValue(30),
  }
})

export default GPSLevel;
