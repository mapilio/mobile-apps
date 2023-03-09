import {SafeAreaProvider} from "react-native-safe-area-context";
import SafeAreaView from "react-native-safe-area-view";
import * as Brightness from "expo-brightness";
import React, {useCallback, useEffect, useState} from "react";
import {Camera, CameraSidebar, Loading} from "../components";
import {useNavigation} from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import {BackHandler, StatusBar, StyleSheet} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import Geolocation from "@react-native-community/geolocation";
import {
  GROUP_ID,
  SET_CAMERA_LOCATION,
  UPDATE_GPS_ACCURACY,
  UPDATE_MOCKED_STATUS, UPDATE_OPENED_STATUS,
  UPDATE_PHOTO_AMOUNT
} from "../store/actionsName";
import {useDispatch, useSelector} from "react-redux";
import * as ScreenOrientation from "expo-screen-orientation";
import uuid from "react-native-uuid";
import {activateKeepAwake, deactivateKeepAwake} from "expo-keep-awake";
import {exitCapture, setNewUUID} from "../helper/camera";
import {Routes} from "../navigator/Routes";
import {useOrientation} from "../hooks/ui";

const AppCamera = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const orientation = useOrientation(500);
  const [isStarted, setIsStarted] = useState(false);
  const [lowBrightness, setLowBrightness] = useState(false);
  const {selectedProject, autoCaptureStart} = useSelector((state) => state.settingsReducer);

  const breakBrightness = () => {
    lowBrightness && Brightness.setSystemBrightnessAsync(0.7).then(() => setLowBrightness(false));
  };

  const watchPosition = () => {
    return Geolocation.watchPosition(({coords, mocked}) => {
      dispatch({type: UPDATE_MOCKED_STATUS, payload: mocked})
      dispatch({type: SET_CAMERA_LOCATION, payload: coords})
      dispatch({type: UPDATE_GPS_ACCURACY, payload: coords.accuracy <= 35})
    }, (error) => {
      toast.show(`${error.message}`, {type: "error"})
    }, {
      timeout: 0,
      enableHighAccuracy: true,
      distanceFilter: 5,
      interval: 0,
      fastestInterval: 0,
    })
  }

  const orientationChange = async () => {
    const currentOrientation = await ScreenOrientation.getOrientationAsync();

    const landscapes = [
      ScreenOrientation.Orientation.LANDSCAPE_LEFT,
      ScreenOrientation.Orientation.LANDSCAPE_RIGHT,
      ScreenOrientation.OrientationLock.LANDSCAPE
    ]

    if (!landscapes.some(landscape => landscape === currentOrientation)) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
    }
  }

  const closeHandler = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{name: Routes.uploadTab, params: {screen: Routes.captureCompleted}}]
    });

    exitCapture();
  }, []);

  useEffect(() => {
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: "whenInUse",
      locationProvider: "playServices",
    });

    StatusBar.setHidden(true)
    dispatch({type: GROUP_ID, payload: uuid.v4()});
    dispatch({type: UPDATE_PHOTO_AMOUNT, payload: 0})
    dispatch({type: UPDATE_OPENED_STATUS, payload: false})
    activateKeepAwake("camera").catch((error) => toast.show(`${error}`, {type: "error"}));
    const id = watchPosition()
    BackHandler.addEventListener('hardwareBackPress', closeHandler);
    orientationChange().catch((error) => toast.show(`${error}`, {type: "error"}));

    return () => {
      deactivateKeepAwake("camera").catch((error) => toast.show(`${error}`, {type: "error"}));
      BackHandler.removeEventListener('hardwareBackPress', closeHandler);
      Geolocation.clearWatch(id);
    }
  }, [])

  useEffect(() => {
    if (autoCaptureStart) {
      setIsStarted(true)
    }

    if (isStarted && !autoCaptureStart) {
      closeHandler();
    }
  }, [autoCaptureStart])

  useEffect(() => setNewUUID(), [selectedProject]);

  if (orientation !== "LANDSCAPE") {
    return <Loading backgroundColor="black" indicatorColor="white" />
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        forceInset={{vertical: "never", horizontal: "never"}}
        style={{flex: 1, flexDirection: "row"}}
        onTouchEndCapture={breakBrightness}
      >
        <Camera />

        <LinearGradient colors={["#11111100", "#111111"]} angle={90} useAngle={true} style={styles.gradient}>
          <CameraSidebar navigation={navigation} setLowBrightness={setLowBrightness}/>
        </LinearGradient>

      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  gradient:{
    padding: RFValue(22),
    backgroundColor: "transparent",
    position: "absolute",
    right: 0,
    height: "100%",
    width: "20%",
    zIndex: 2,
  }
});
export default AppCamera;
