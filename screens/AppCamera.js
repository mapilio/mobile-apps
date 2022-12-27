import React, { useEffect, useState } from "react";
import {Platform, View} from "react-native";
import {Camera, CameraSidebar} from "../components";
import { RFValue } from "react-native-responsive-fontsize";
import {activateKeepAwake, deactivateKeepAwake} from "expo-keep-awake";
import * as Brightness from "expo-brightness";
import Geolocation from "react-native-geolocation-service";
import {useDispatch, useSelector} from "react-redux";
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import {
  SET_CAMERA_LOCATION,
  UPDATE_GPS_ACCURACY,
  UPDATE_MOCKED_STATUS,
  UPDATE_OPENED_STATUS
} from "../store/actionsName";
import * as ScreenOrientation from "expo-screen-orientation";
import {exitCapture, setNewUUID} from "../helper/camera";
import LinearGradient from "react-native-linear-gradient";
import {useNavigation} from "@react-navigation/native";

const AppCamera = () => {
  const {distanceBetween, selectedProject, autoCaptureStart} = useSelector((state) => state.settingsReducer);
  const {photoAmount} = useSelector((state) => state.cameraReducer);
  const [lowBrightness, setLowBrightness] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    if (autoCaptureStart) {
      setNewUUID();
      setIsStarted(true)
    }

    if (isStarted && !autoCaptureStart) {
      navigation.reset({index: 0, routes: [{name: "UploadTab"}]});
      exitCapture()
    }
  }, [autoCaptureStart]);

  useEffect(() => setNewUUID(), [selectedProject]);

  useEffect(() => {
    if(photoAmount >= 250) {setNewUUID()}
  }, [photoAmount]);

  const breakBrightness = () => {
    lowBrightness && Brightness.setSystemBrightnessAsync(0.7).then(() => setLowBrightness(false));
  };

  const watchPosition = () => {
    return Geolocation.watchPosition((location) => {
      dispatch({type: UPDATE_MOCKED_STATUS, payload: location.mocked})
      dispatch({type: SET_CAMERA_LOCATION, payload: location.coords})
      dispatch({type: UPDATE_GPS_ACCURACY, payload: location.coords.accuracy <= 20})
    }, (error) => {
      toast.show(`${error.message}`, {type: "error"})
    }, {
      distanceFilter: distanceBetween,
      enableHighAccuracy: true,
      accuracy: Platform.OS === 'android' ? 'high' : 'bestForNavigation',
    })
  }

  useEffect(() => {
    activateKeepAwake("camera");
    let watchID = watchPosition()
    dispatch({type: UPDATE_OPENED_STATUS, payload: false})

    ScreenOrientation.getOrientationLockAsync().then(currentOrientation => {
      if (
        currentOrientation !== ScreenOrientation.OrientationLock.LANDSCAPE ||
        currentOrientation !== ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT ||
        currentOrientation !== ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
      ) {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch((error) => {
          toast.show(`${error}`, {type: "error"})
        });
      }
    })

    return () => {
      Geolocation.clearWatch(watchID)
      deactivateKeepAwake("camera")
    }
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        forceInset={{vertical: 'never', horizontal: 'never'}}
        style={{flex: 1, flexDirection: "row"}}
        onTouchEndCapture={breakBrightness}
      >
        <View style={{flex: 1, position: "relative"}}>
          <Camera navigation={navigation}/>
        </View>
        <LinearGradient
          colors={['#11111100', '#111111']}
          angle={90}
          useAngle={true}
          style={{
            padding: RFValue(22),
            backgroundColor: "transparent",
            position: "absolute",
            right: 0,
            height: "100%",
            width: RFValue(180),
            zIndex: 2,
          }}
        >
          <CameraSidebar navigation={navigation} setLowBrightness={setLowBrightness}/>
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default AppCamera;
