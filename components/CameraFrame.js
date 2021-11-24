import React from "react";
import { View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  CameraCenter,
  FrameLeftBottom,
  FrameLeftTop,
  FrameRightBottom,
  FrameRightTop,
} from "../assets/svg/illustrations";

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
    </View>
    <View style={{ position: "absolute", top: 0, right: 0 }}>
      <FrameRightTop />
    </View>
    <View style={{ position: "absolute", bottom: 0, left: 0 }}>
      <FrameLeftBottom />
    </View>
    <View style={{ position: "absolute", bottom: 0, right: 0 }}>
      <FrameRightBottom />
    </View>
  </View>
);

export default CameraFrame;
