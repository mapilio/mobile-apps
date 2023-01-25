import React from "react";
import {StyleSheet, View} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {CameraCenter} from "../assets/svg/illustrations";
import { tooltipContents } from "../util/consts/tooltip";
import BatteryLevel from "./BatteryLevel";
import GPSLevel from "./GPSLevel";
import PhotoAmounts from "./PhotoAmounts";
import RecordStatus from "./RecordStatus";
import { TooltipWrapper } from "./Tooltip";

const CameraFrame = () => {
  return (
    <View style={styles.wrapper}>
      <TooltipWrapper
        content={tooltipContents.camera.angle}
        name="angle"
        placement="right"
      >
        <View style={styles.wrapper}>
          <CameraCenter />
        </View>
      </TooltipWrapper>
      <View style={styles.battery}>
        <BatteryLevel />
      </View>
      <View style={styles.record}>
        <RecordStatus />
      </View>
      <View style={styles.amount}>
        <PhotoAmounts />
      </View>
      <View style={styles.gps}>
        <GPSLevel />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    flex: 1,
    marginVertical: RFValue(25),
    marginHorizontal: RFValue(20),
    justifyContent: "center",
    alignItems: "center"
  },
  battery: {
    position: "absolute",
    top: 0,
    left: 0
  },
  record: {
    position: "absolute",
    top: 0,
    right: 0
  },
  amount: {
    position: "absolute",
    bottom: 0,
    left: 0
  },
  gps: {
    position: "absolute",
    bottom: 0,
    right: 0
  }
})

export default CameraFrame;
