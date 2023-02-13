import React, {useCallback, useEffect, useState} from "react";
import {BackHandler, Dimensions, Platform, StatusBar, StyleSheet, View} from "react-native";
import {Camera, CameraSidebar} from "../components";
import { RFValue } from "react-native-responsive-fontsize";
import {activateKeepAwake, deactivateKeepAwake} from "expo-keep-awake";
import * as Brightness from "expo-brightness";
import Geolocation from "react-native-geolocation-service";
import {useDispatch, useSelector} from "react-redux";
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import {
  GROUP_ID,
  SET_CAMERA_LOCATION,
  UPDATE_GPS_ACCURACY,
  UPDATE_MOCKED_STATUS,
  UPDATE_OPENED_STATUS,
  UPDATE_PHOTO_AMOUNT
} from "../store/actionsName";
import * as ScreenOrientation from "expo-screen-orientation";
import {exitCapture, setNewUUID} from "../helper/camera";
import LinearGradient from "react-native-linear-gradient";
import {useNavigation} from "@react-navigation/native";
import {Routes} from "../navigator/Routes";
import uuid from "react-native-uuid";
import { useOrientation } from "../hooks/ui";
import {Loading} from "../components";

const AppCamera = () => {
  const orientation = useOrientation(500);
  const { distanceBetween, selectedProject, autoCaptureStart } = useSelector(
    (state) => state.settingsReducer
  );
  const { photoAmount } = useSelector((state) => state.cameraReducer);
  const [lowBrightness, setLowBrightness] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [watchID, setWatchID] = useState([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    if (autoCaptureStart) {
      setIsStarted(true)
    }

    if (isStarted && !autoCaptureStart) {
      closeHandler()

      if (photoAmount >= 5) {
        navigation.reset({
          index: 0,
          routes: [{name: Routes.uploadTab, params: {screen: Routes.captureCompleted}}]
        });
      } else {
        navigation.reset({index: 0, routes: [{name: Routes.uploadTab}]});
      }
    }
  }, [autoCaptureStart]);

  useEffect(() => setNewUUID(), [selectedProject]);

  const breakBrightness = () => {
    lowBrightness && Brightness.setSystemBrightnessAsync(0.7).then(() => setLowBrightness(false));
  };

  const closeHandler = useCallback(() => {
    navigation.reset({index: 0, routes: [{name: "UploadTab"}]});
    exitCapture();
  }, []);

  const clearWatch = () => {
    watchID.forEach(id => {
      Geolocation.clearWatch(id)
      setWatchID(prev => prev.filter(item => item !== id))
    })
  }

  const watchPosition = () => {
    return Geolocation.watchPosition((location) => {
      dispatch({type: UPDATE_MOCKED_STATUS, payload: location.mocked})
      dispatch({type: SET_CAMERA_LOCATION, payload: location.coords})
      dispatch({type: UPDATE_GPS_ACCURACY, payload: location.coords.accuracy <= 20})
      setAccuracy(location.coords.accuracy)
    }, (error) => {
      toast.show(`${error.message}`, {type: "error"})
    }, {
      distanceFilter: distanceBetween,
      enableHighAccuracy: true,
      accuracy: Platform.OS === 'android' ? 'high' : 'bestForNavigation',
    })
  }

  useEffect(() => {
    dispatch({type: GROUP_ID, payload: uuid.v4()});
    dispatch({type: UPDATE_PHOTO_AMOUNT, payload: 0})

    activateKeepAwake("camera");
    BackHandler.addEventListener('hardwareBackPress', closeHandler);
    const id = watchPosition()
    setWatchID(prev => [...prev, id])
    StatusBar.setHidden(true)
    dispatch({type: UPDATE_OPENED_STATUS, payload: false})

    ScreenOrientation.getOrientationLockAsync().then(currentOrientation => {
      if (
        currentOrientation !== ScreenOrientation.OrientationLock.LANDSCAPE ||
        currentOrientation !== ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT ||
        currentOrientation !== ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
      ) {
          ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE
          ).catch((error) => {
            toast.show(`${error}`, { type: "error" });
          });
      }
    });

    return () => {
      watchID.forEach(id => Geolocation.clearWatch(id))
      BackHandler.removeEventListener('hardwareBackPress', closeHandler);
      deactivateKeepAwake("camera")
    }
  }, []);

  useEffect(() => {
    if (accuracy >= 20 && !photoAmount) {
      clearWatch()

      setTimeout(() => {
        const id = watchPosition()
        setWatchID(prev => [...prev, id])
      }, 2000)
    }
  }, [accuracy]);


  return (
    <SafeAreaProvider>
      {orientation === "LANDSCAPE" ? (
        <SafeAreaView
          forceInset={{ vertical: "never", horizontal: "never" }}
          style={{ flex: 1, flexDirection: "row" }}
          onTouchEndCapture={breakBrightness}
        >
         <Camera navigation={navigation} />
          <LinearGradient
            colors={["#11111100", "#111111"]}
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
      ) : (
        <Loading backgroundColor="black" indicatorColor="white" />
      )}
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
