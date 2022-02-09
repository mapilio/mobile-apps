import React, { useState } from "react";
import { View } from "react-native";
import { Camera, CameraSidebar } from "../components";
import { RFValue } from "react-native-responsive-fontsize";
import { useKeepAwake } from "expo-keep-awake";
import * as Brightness from "expo-brightness";

const AppCamera = ({ navigation }) => {
  const [lowBrightness, setLowBrigthness] = useState(false);
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
        <Camera navigation={navigation} />
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
        />
      </View>
    </View>
  );
};

export default AppCamera;
