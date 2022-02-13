import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Camera, CameraSidebar } from "../components";
import { RFValue } from "react-native-responsive-fontsize";
import { useKeepAwake } from "expo-keep-awake";
import * as Brightness from "expo-brightness";
import { Routes } from "../navigator/Routes";

const AppCamera = ({ navigation, route }) => {
  const [lowBrightness, setLowBrigthness] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const timeout = useRef(null);
  const waitGPS = useRef(true);

  useKeepAwake();

  const breakBrightness = () => {
    if (lowBrightness) {
      Brightness.setSystemBrightnessAsync(0.7);
      setLowBrigthness(false);
    }
  };

  return (
    <View
      style={{ flex: 1, flexDirection: "row" }}
      onTouchEndCapture={breakBrightness}
    >
      <View style={{ flex: 0.78 }}>
        <Camera
          navigation={navigation}
          route={route}
          cameraReady={cameraReady}
          setCameraReady={setCameraReady}
          timeout={timeout}
          waitGPS={waitGPS}
        />
      </View>
      <View
        style={{
          flex: 0.22,
          backgroundColor: "#2E2E2E",
          padding: RFValue(22),
        }}
      >
        <CameraSidebar
          navigation={navigation}
          setLowBrigthness={setLowBrigthness}
          setCameraReady={setCameraReady}
          timeout={timeout}
          waitGPS={waitGPS}
        />
      </View>
    </View>
  );
};

export default AppCamera;
