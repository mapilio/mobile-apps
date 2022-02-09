import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Camera, CameraSidebar } from "../components";
import { RFValue } from "react-native-responsive-fontsize";
import { useKeepAwake } from "expo-keep-awake";
import * as Brightness from "expo-brightness";

const AppCamera = ({ navigation, route }) => {
  const [lowBrightness, setLowBrigthness] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const backButtonRef = useRef(null);
  const [dene, setDene] = useState(0);

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
          backButton={backButtonRef.current}
          dene={dene}
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
          setDene={setDene}
          setLowBrigthness={setLowBrigthness}
          setCameraReady={setCameraReady}
          backButtonRef={backButtonRef}
        />
      </View>
    </View>
  );
};

export default AppCamera;
