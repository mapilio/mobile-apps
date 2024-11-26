import {SafeAreaProvider} from "react-native-safe-area-context";
import SafeAreaView from "react-native-safe-area-view";
import * as Brightness from "expo-brightness";
import React, { useCallback, useEffect, useState } from "react";
import { Camera, CameraSidebar, Loading } from "../components";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { BackHandler, StatusBar, StyleSheet, AppState, Text, Platform } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import {
  GROUP_ID,
  SET_CAMERA_LOCATION,
  UPDATE_GPS_ACCURACY,
  UPDATE_MOCKED_STATUS,
  UPDATE_OPENED_STATUS,
  UPDATE_PHOTO_AMOUNT,
} from "../store/actionsName";
import { useDispatch } from "react-redux";
import * as ScreenOrientation from "expo-screen-orientation";
import uuid from "react-native-uuid";
import { exitCapture } from "../helper/camera";
import { Routes } from "../navigator/Routes";
import { useOrientation } from "../hooks/ui";
import {
  LocationAccuracy,
  watchPositionAsync,
} from "expo-location";
import { captureException } from '@sentry/react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

const AppCamera = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const orientation = useOrientation(500);
  const [lowBrightness, setLowBrightness] = useState(false);

  const breakBrightness = () => {
    lowBrightness &&
      Brightness.setSystemBrightnessAsync(0.7).then(() =>
        setLowBrightness(false)
      );
  };

  const watchPosition = () => {
    return watchPositionAsync(
      {
        accuracy: LocationAccuracy.BestForNavigation,
        distanceInterval: 5,
        timeInterval: 0,
      },
      ({ coords, mocked }) => {
        dispatch({ type: UPDATE_MOCKED_STATUS, payload: mocked });
        dispatch({ type: SET_CAMERA_LOCATION, payload: coords });
        dispatch({
          type: UPDATE_GPS_ACCURACY,
          payload: coords.accuracy <= 35,
        });
      }
    ).catch((error) => {
      captureException(error, {
        tags: {
          priority: 'GPSFatal',
          screen: 'AppCamera',
          function: 'watchPosition',
        },
      });
      toast.show("GPS Error. Please restart your app", { type: "error" });
    });
  };
  const closeHandler = useCallback(() => {
    exitCapture();

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: Routes.uploadTab, params: {screen: Routes.captureCompleted}}]
      })
    );
  }, []);

  useEffect(() => {
    StatusBar.setHidden(true);
    dispatch({ type: GROUP_ID, payload: uuid.v4() });
    dispatch({ type: UPDATE_PHOTO_AMOUNT, payload: 0 });
    dispatch({ type: UPDATE_OPENED_STATUS, payload: false });
    activateKeepAwakeAsync("camera").catch((error) =>
      toast.show(`${error}`, { type: "error" })
    );
    const gpsSubscription = watchPosition();
    const appStateSubscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        gpsSubscription.then((sub) => {
          sub.remove();
          dispatch({
            type: UPDATE_GPS_ACCURACY,
            payload: false,
          });
        });
      }
    });
    BackHandler.addEventListener('hardwareBackPress', closeHandler);
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    return () => {
      deactivateKeepAwake("camera").catch((error) =>
        toast.show(`${error}`, { type: "error" })
      );
      BackHandler.removeEventListener("hardwareBackPress", closeHandler);
      appStateSubscription.remove();
      gpsSubscription
        .then((sub) => {
          sub.remove();
        })
        .catch((error) => {
          captureException(error, {
            tags: {
              priority: 'GPSFatal',
              screen: 'AppCamera',
              function: 'gpsSubscription',
            },
          });
          toast.show("GPS Error. Please restart your app", {
            type: "error",
          });
        });
    };
  }, []);

  if (orientation !== "LANDSCAPE") {
    return <Loading backgroundColor="black" indicatorColor="white" />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        forceInset={{ vertical: "never", horizontal: "never" }}
        style={{ flex: 1, flexDirection: "row" }}
        onTouchEndCapture={breakBrightness}
      >
        <Camera />

        <LinearGradient
          colors={["rgba(51, 51, 51, 0)", "rgba(0, 0, 0, 0.8)"]}
          style={styles.gradient}
          start={{ x: 0, y: 1 }}
        >
          <CameraSidebar setLowBrightness={setLowBrightness} />
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  gradient:{
    padding: RFValue(16),
    position: "absolute",
    right: 0,
    height: "100%",
    width: "25%",
    zIndex: 2,
  }
});
export default AppCamera;
