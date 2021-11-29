import React from "react";
import { Dimensions, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  CameraCenter,
  FrameLeftBottom,
  FrameLeftTop,
  FrameRightBottom,
  FrameRightTop,
  GoodGPS,
} from "../assets/svg/illustrations";
import BatteryLevel from "./BatteryLevel";
import GPSLevel from "./GPSLevel";
import PhotoAmounts from "./PhotoAmounts";
import RecordStatus from "./RecordStatus";
import { CustomTextMedium } from "../highordercomponents";

const CameraFrame = () => (
  <View
    style={{
      flex: 1,
      marginVertical: RFValue(25),
      marginHorizontal: RFValue(20),
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <CameraCenter />
    <View style={{ position: "absolute", top: 0, left: 0 }}>
      <FrameLeftTop />
      <BatteryLevel />
    </View>
    <View style={{ position: "absolute", top: 0, right: 0 }}>
      <FrameRightTop />
      <RecordStatus />
    </View>
    <View style={{ position: "absolute", bottom: 0, left: 0 }}>
      <PhotoAmounts />
      <FrameLeftBottom />
    </View>
    <View style={{ position: "absolute", bottom: 0, right: 0 }}>
      <GPSLevel />
      <FrameRightBottom />
    </View>
  </View>
);

export default CameraFrame;
