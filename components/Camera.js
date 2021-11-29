import React, { useEffect } from "react";
import { Camera as ExpoCamera } from "expo-camera";
import * as ScreenOrientation from "expo-screen-orientation";
import { Alert, Linking, Platform } from "react-native";
import { Routes } from "../navigator/Routes";
import CameraFrame from "./CameraFrame";
import CameraInfos from "./CameraInfos";

const Camera = ({ navigation }) => {
  useEffect(() => {
    __startCamera();
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
    );
  }, []);

  const __startCamera = async () => {
    const { status } = await ExpoCamera.requestCameraPermissionsAsync();
    if (status === "granted") {
      // todo something
    } else {
      alertHandler();
    }
  };

  const alertHandler = () => {
    Alert.alert("Alert title", "Alert test", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => navigation.navigate(Routes.profile),
      },
      {
        text: "Allow",
        onPress: async () =>
          Platform.OS === "ios"
            ? Linking.openURL("app-settings:")
            : Linking.openSettings(),
      },
    ]);
  };

  return (
    <>
      <ExpoCamera
        style={{
          flex: 1,
          position: "relative",
        }}
        ref={(r) => {
          camera = r;
        }}
      >
        <CameraFrame />
        <CameraInfos/>
      </ExpoCamera>
    </>
  );
};

export default Camera;
