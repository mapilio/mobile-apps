import React, { useEffect, useRef, useState } from "react";
import { Camera as ExpoCamera } from "expo-camera";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  Platform,
  StatusBar,
  View,
} from "react-native";
import { Routes } from "../navigator/Routes";
import CameraFrame from "./CameraFrame";
import CameraAlert from "./CameraAlert";
import CameraProjectInfo from "./CameraProjectInfo";
import { Accelerometer } from "expo-sensors";
import RotationLine from "./RotationLine";
import * as Location from "expo-location";
import Database from "../db";
import {
  UPDATE_CAMERA_REF,
  UPDATE_CAMERA_STATUS,
  UPDATE_GPS_ACCURACY,
  UPDATE_START_ACCURACY,
  UPDATE_MOCKED_STATUS,
  UPDATE_HIGHSPEED_STATUS,
  UPDATE_BATTERY_STATUS,
} from "../store/actionsName";
import { useDispatch, useSelector } from "react-redux";
import {permissionHandler} from "../helper/helper";
import {toastMessage} from "../helper/alerts";
import {CustomTextMedium} from "../highordercomponents";
import {cameraStyles} from "../styles/cameraStyles";
import {cameraAlerts} from "../helper/camera";

const Camera = ({
  navigation,
  route,
  cameraReady,
  setCameraReady,
  timeout,
  waitGPS,
}) => {
  const [degree, setDegree] = useState(0);
  const [gps, setGPS] = useState(true);
  const fadeAnimation = useRef(new Animated.Value(0.7)).current;
  const dispatch = useDispatch();
  const { batteryLevel, isCharge, batteryStatus, mocked, highSpeed, GPSAccuracy, GPSStartAccuracy, rotateStatus } = useSelector((state) => state.cameraReducer);
  const { cameraWalkthroughStatus } = useSelector((state) => state.generalReducer);
  const cameraRef = useRef(null);
  let location = null;
  let accelerometerSubscription = null;

  useEffect(() => {
    if (route.name === "Camera") {
      BackHandler.addEventListener("hardwareBackPress", () => true);
    }
    _subscribeToAccelerometer();
    _subscribeProvider();

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", () => true);
      Accelerometer.removeAllListeners()
      navigation.removeListener("focus");
      navigation.removeListener("blur");
      clearTimeout(timeout?.current)
      location?.remove();
    }
  }, []);

  useEffect(() => {
    navigation.addListener("focus", async () => {
      setCameraReady(true);
      await permissionHandler(false, goProfile, () => false, "camera");
      await _startNetworkProvider();
      StatusBar.setHidden(true);

      const currentOrientation = await ScreenOrientation.getOrientationLockAsync();
      if (currentOrientation !== 5 || currentOrientation !== 6 || currentOrientation !== 7 ) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      }
    })

    navigation.addListener("blur", () => {
      setCameraReady(false);
    });
  }, [navigation])

  useEffect(() => {
    dispatch({
      type: UPDATE_BATTERY_STATUS,
      payload: !isCharge && ((batteryLevel <= 20 && Platform.OS === "ios") || (batteryLevel <= 15 && Platform.OS === "android"))
    });
  }, [batteryLevel, isCharge]);

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 0,
      duration: 1300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);

  const goProfile = () => navigation.reset({index: 0, routes: [{name: Routes.profile}]});

  const _subscribeToAccelerometer = () => {
    accelerometerSubscription = Accelerometer.addListener(
      (accelerometerData) => {
        const { x, y } = accelerometerData;
        let angle = Math.atan2(y, x) * (180 / Math.PI);
        angle = angle + 90;
        angle = (angle + 360) % 360;
        angle = Math.floor(angle);
        if (angle !== degree) {
          setDegree(angle);
        }
      }
    );
  };

  const _startNetworkProvider = async () => await Location.enableNetworkProviderAsync().then((res) => res).catch((err) => err);

  const _subscribeProvider = async () => {
    location = await Location.watchPositionAsync({accuracy: Location.Accuracy.High, distanceInterval: 0},
      (location) => {        dispatch({type: UPDATE_MOCKED_STATUS, payload: location.mocked});
        dispatch({ type: UPDATE_HIGHSPEED_STATUS, payload: location.coords.speed >= 70 });

        if (gps && waitGPS.current) {
          startAccuracyHandler(location.coords.accuracy);
        }
        dispatch({ type: UPDATE_GPS_ACCURACY, payload: location.coords.accuracy <= 50 });
      }
    );
  };

  useEffect(() => {
    if (gps) {
      timeout.current = setTimeout(() => {
        toastMessage.error("GPS accuracy is not enough. Please try again.")
        navigation.reset({index: 0, routes: [{name: Routes.profile}]})
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      }, 3000 * 10);
    } else {
      clearTimeout(timeout?.current);
      timeout = null;
    }
  }, [gps]);

  const startAccuracyHandler = (accuracy) => {
    if (accuracy > 50) {
      dispatch({ type: UPDATE_START_ACCURACY, payload: false });
    } else {
      dispatch({ type: UPDATE_START_ACCURACY, payload: true });
      waitGPS.current = false;
      setGPS(false);
    }
  };

  const onCameraReady = () => {
    dispatch({ type: UPDATE_CAMERA_STATUS, payload: "READY" });
    dispatch({ type: UPDATE_CAMERA_REF, payload: cameraRef.current });
    if (!cameraWalkthroughStatus) {
      navigation.navigate(Routes.walkthrough);
    }
  };

  if (cameraReady) {
    return (
      <ExpoCamera
        style={cameraStyles.camera}
        ref={cameraRef}
        onCameraReady={onCameraReady}
        autoFocus={"off"}
        focusDepth={1}
      >
        <RotationLine degree={degree}/>
        <CameraFrame navigation={navigation} />
        <CameraProjectInfo navigation={navigation} />
        {!GPSAccuracy && GPSStartAccuracy ? cameraAlerts.gpsAlert() : null}
        {!GPSStartAccuracy && cameraAlerts.gpsStartAlert()}
        {rotateStatus && GPSStartAccuracy ? cameraAlerts.rotate() : null}
        {batteryStatus && GPSStartAccuracy ? cameraAlerts.battery() : null}
        {mocked && GPSStartAccuracy ? cameraAlerts.mocked() : null}
        {highSpeed && GPSStartAccuracy ? cameraAlerts.highSpeed() : null}
      </ExpoCamera>
    );
  } else {
    return (
      <View style={cameraStyles.notReadyContainer}>
        <ActivityIndicator size={"large"} color={"#FFFFFF"} />
        <CustomTextMedium style={cameraStyles.notReadyText}>
          Camera is getting ready. Please wait.
        </CustomTextMedium>
      </View>
    );
  }
};

export default Camera;
