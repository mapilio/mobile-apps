import {SafeAreaProvider} from "react-native-safe-area-context";
import SafeAreaView from "react-native-safe-area-view";
import * as Brightness from "expo-brightness";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Camera, CameraSidebar, Loading } from "../components";
import { useNavigation, CommonActions } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { BackHandler, StatusBar, StyleSheet, AppState } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  GROUP_ID,
  SET_CAMERA_LOCATION,
  UPDATE_GPS_ACCURACY,
  UPDATE_MOCKED_STATUS,
  UPDATE_OPENED_STATUS,
  UPDATE_PHOTO_AMOUNT,
} from "../store/actionsName";
import { useDispatch, useSelector } from "react-redux";
import * as ScreenOrientation from "expo-screen-orientation";
import uuid from "react-native-uuid";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import { exitCapture, setNewUUID } from "../helper/camera";
import { Routes } from "../navigator/Routes";
import { useOrientation } from "../hooks/ui";
import {
  LocationAccuracy,
  watchPositionAsync,
  enableNetworkProviderAsync,
} from "expo-location";

const AppCamera = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const orientation = useOrientation(500);
  const [isStarted, setIsStarted] = useState(false);
  const [lowBrightness, setLowBrightness] = useState(false);
  const { selectedProject, autoCaptureStart } = useSelector(
    (state) => state.settingsReducer
  );
  const locationSubscription = useRef(null);
  const appState = useRef(AppState.currentState);
  const accuracyRef = useRef(null);

  const breakBrightness = () => {
    lowBrightness &&
      Brightness.setSystemBrightnessAsync(0.7).then(() =>
        setLowBrightness(false)
      );
  };

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const refreshGeolocationIfNotAvailable = () => {
    setTimeout(async () => {
      if (!accuracyRef.current) {
        removeWatchPosition();
        await delay(500);
        watchPosition();
      }
    }, 7000);
  };

  const watchPosition = async () => {
    locationSubscription.current = await watchPositionAsync(
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
          payload: coords.accuracy <= 50,
        });
        accuracyRef.current = coords.accuracy <= 50;
      }
    );
  };

  const AppStateHandler = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      watchPosition();
    } else {
      removeWatchPosition();
    }
    appState.current = nextAppState;
  };

  const removeWatchPosition = () => {
    locationSubscription.current && locationSubscription.current.remove();
    locationSubscription.current = null;
    accuracyRef.current = null;
  };

  const closeHandler = useCallback(() => {
    exitCapture();

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: Routes.uploadTab }],
      })
    );
  }, []);

  useEffect(() => {
    StatusBar.setHidden(true);
    dispatch({ type: GROUP_ID, payload: uuid.v4() });
    dispatch({ type: UPDATE_PHOTO_AMOUNT, payload: 0 });
    dispatch({ type: UPDATE_OPENED_STATUS, payload: false });
    activateKeepAwake("camera").catch((error) =>
      toast.show(`${error}`, { type: "error" })
    );
    watchPosition();
    refreshGeolocationIfNotAvailable();
    BackHandler.addEventListener("hardwareBackPress", closeHandler);
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    enableNetworkProviderAsync().catch((error) =>
      toast.show(`${error}`, { type: "error" })
    );

    const subscription = AppState.addEventListener("change", AppStateHandler);

    return () => {
      deactivateKeepAwake("camera").catch((error) =>
        toast.show(`${error}`, { type: "error" })
      );
      BackHandler.removeEventListener("hardwareBackPress", closeHandler);
      removeWatchPosition();
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (autoCaptureStart) {
      setIsStarted(true);
    }

    if (isStarted && !autoCaptureStart) {
      closeHandler();
    }
  }, [autoCaptureStart]);

  useEffect(() => setNewUUID(), [selectedProject]);

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
          angle={90}
          useAngle={true}
          style={styles.gradient}
        >
          <CameraSidebar
            navigation={navigation}
            setLowBrightness={setLowBrightness}
          />
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
