import React, { useEffect, useRef, useState } from "react";
import {Platform, View} from "react-native";
import { Camera, CameraSidebar } from "../components";
import { RFValue } from "react-native-responsive-fontsize";
import {activateKeepAwake, deactivateKeepAwake} from "expo-keep-awake";
import * as Brightness from "expo-brightness";
import Geolocation from "react-native-geolocation-service";
import {useDispatch, useSelector} from "react-redux";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import {SET_CAMERA_LOCATION, UPDATE_GPS_ACCURACY, UPDATE_MOCKED_STATUS} from "../store/actionsName";
import * as ScreenOrientation from "expo-screen-orientation";
import {exitCapture, setNewUUID} from "../helper/camera";
import {Routes} from "../navigator/Routes";

const AppCamera = ({ navigation, route }) => {
  const {
    distanceBetween,
    selectedProject,
    autoCaptureStart,
    accuracyLevel
  } = useSelector((state) => state.settingsReducer);
  const {photoAmount} = useSelector((state) => state.cameraReducer);
  const [lowBrightness, setLowBrightness] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const timeout = useRef(null);
  const waitGPS = useRef(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (autoCaptureStart) {
      setNewUUID();
      setIsStarted(true)
    }

    if (isStarted && !autoCaptureStart) {
      exitCapture()
      navigation.reset({index: 0, routes: [{ name: Routes.upload }]});
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
      dispatch({type: UPDATE_GPS_ACCURACY, payload: location.coords.accuracy < accuracyLevel})
    }, (error) => {
      toast.show(`${error.message}`, {type: "error"})
    }, {
      distanceFilter: distanceBetween,
      enableHighAccuracy: true,
      accuracy: Platform.OS === 'android' ? 'high' : 'best',
    })
  }

  useEffect(() => {
    activateKeepAwake();
    let watchID = watchPosition()

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

    return (() => {
      Geolocation.clearWatch(watchID)
      deactivateKeepAwake()
    })
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        forceInset={{vertical: 'never', horizontal: 'never'}}
        style={{flex: 1, flexDirection: "row"}}
        onTouchEndCapture={breakBrightness}
      >
        <View style={{flex: 0.78}}>
          <Camera navigation={navigation}/>
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
            setLowBrightness={setLowBrightness}
            timeout={timeout}
            waitGPS={waitGPS}
            route={route}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default AppCamera;
