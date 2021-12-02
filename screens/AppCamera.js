import React, { useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { View, StatusBar } from "react-native";
import { Camera, CameraSidebar } from "../components";
import { RFValue } from "react-native-responsive-fontsize";

const AppCamera = ({ navigation }) => {
  useEffect(() => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
    );
    StatusBar.setHidden(true);
  }, []);

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
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
        <CameraSidebar navigation={navigation} />
      </View>
    </View>
  );
};

export default AppCamera;
