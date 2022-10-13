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
import {
  SET_CAMERA_LOCATION,
  UPDATE_GPS_ACCURACY,
  UPDATE_HIGHSPEED_STATUS,
  UPDATE_MOCKED_STATUS
} from "../store/actionsName";
import {toastMessage} from "../helper/alerts";
import * as ScreenOrientation from "expo-screen-orientation";
import {exitCapture, setNewUUID} from "../helper/camera";
import {Routes} from "../navigator/Routes";

const AppCamera = ({ navigation, route }) => {
  const { distanceBetween, selectedProject, autoCaptureStart } = useSelector((state) => state.settingsReducer);
  const { photoAmount } = useSelector((state) => state.cameraReducer);
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

  useEffect(() => photoAmount >= 250 && setNewUUID(), [photoAmount]);


  const breakBrightness = () => {
    lowBrightness && Brightness.setSystemBrightnessAsync(0.7).then(() => setLowBrightness(false));
  };

  const watchPosition = () => {
    return Geolocation.watchPosition((location) => {
      dispatch({type: UPDATE_MOCKED_STATUS, payload: location.mocked})
      dispatch({type: SET_CAMERA_LOCATION, payload: location.coords})
      dispatch({type: UPDATE_GPS_ACCURACY, payload: location.coords.accuracy < 15})
      dispatch({type: UPDATE_HIGHSPEED_STATUS, payload: location.coords.speed >= (70 / 3.36)})
    }, (error) => {
      toastMessage.error(`${error.message}`)
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
          toastMessage.error(`${error}`)
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
