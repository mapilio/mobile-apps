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
  UPLOAD_DATA,
  UPDATE_PHOTO_AMOUNT,
} from "../store/actionsName";
import { useDispatch, useSelector } from "react-redux";
import {
  BadGPS,
  BatteryLevelIcon,
  GPSSearch,
  HighSpeedIcon,
  InternetAccessIcon,
  MockedIcon,
} from "../assets/svg/illustrations";
import { RFValue } from "react-native-responsive-fontsize";
import {permissionHandler} from "../helper/helper";
import {toastMessage} from "../helper/alerts";
import {CustomTextMedium} from "../highordercomponents";
import {cameraStyles} from "../styles/cameraStyles";

const Camera = ({
  navigation,
  cameraReady,
  setCameraReady,
  timeout,
  waitGPS,
}) => {
  const [degree, setDegree] = useState(0);
  const [batteryAlert, setBatteryAlert] = useState(null);
  const [mockedAlert, setMockedAlert] = useState(null);
  const [speedAlert, setSpeedAlert] = useState(null);
  const [GPSAlert, setGPSAlert] = useState(null);
  const [GPSStartAlert, setGPSStartAlert] = useState(null);
  const [rotateAlert, setRotateAlert] = useState(null);
  const [gps, setGPS] = useState(true);
  const fadeAnimation = useRef(new Animated.Value(0.7)).current;
  const dispatch = useDispatch();
  const { batteryLevel, isCharge } = useSelector((state) => state.cameraReducer);
  const { cameraWalkthroughStatus } = useSelector((state) => state.generalReducer);
  const cameraRef = useRef(null);
  let location = null;
  let accelerometerSubscription = null;

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => true);
    _subscribeToAccelerometer();
    _subscribeProvider();
  }, [])

  useEffect(() => () => {
    BackHandler.removeEventListener("hardwareBackPress", () => true);
    Accelerometer.removeAllListeners()
    navigation.removeListener("focus");
    navigation.removeListener("blur");
    clearTimeout(timeout?.current)
    location?.remove();
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
    if (!isCharge && ((batteryLevel <= 20 && Platform.OS === "ios") || (batteryLevel <= 15 && Platform.OS === "android"))) {
      setBatteryAlert({
        svg: <BatteryLevelIcon/>,
        title: "Battery level low",
        content: "GPS accuracy will decrease because your charge is below 20%. In this case, shooting is not possible.",
      })
    } else {
      setBatteryAlert(null);
    }
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
        let x = accelerometerData.x;
        let y = accelerometerData.y;
        let angle = Math.atan2(y, x);
        angle = angle * (180 / Math.PI);
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
    location = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 0,
      },
      (location) => {
        if (location.mocked && mockedAlert === null) {
          setMockedAlert({
            svg: <MockedIcon />,
            title: "Fake GPS",
            content:
              "Fake gps usage has been detected, please use device gps location to proceed!",
          });
          dispatch({ type: UPDATE_MOCKED_STATUS, payload: true });
        } else if (!location.mocked && mockedAlert !== null) {
          setMockedAlert(null);
          dispatch({ type: UPDATE_MOCKED_STATUS, payload: false });
        }
        if (Math.round(location.coords.speed) >= 70 && speedAlert === null) {
          dispatch({ type: UPDATE_HIGHSPEED_STATUS, payload: true });
          setSpeedAlert({
            svg: <HighSpeedIcon />,
            title: "High speed",
            content:
              "You exceeded the high speed limit. For precision, your speed should be a maximum of 70km.",
          });
        } else if (speedAlert !== null) {
          dispatch({ type: UPDATE_HIGHSPEED_STATUS, payload: false });
          setSpeedAlert(null);
        }
        if (gps && waitGPS.current) {
          startAccuracyHandler(location.coords.accuracy);
        }
        accuracyHandler(location.coords.accuracy);
      }
    );
  };

  const accuracyHandler = (accuracy) => {
    if (accuracy >= 20) {
      dispatch({ type: UPDATE_GPS_ACCURACY, payload: false });
      setGPSAlert({
        svg: <BadGPS width={RFValue(34)} height={RFValue(30)} />,
        title: "GPS accuracy is too low",
        content: "Shooting will continue when the GPS alert icon turns green.",
      });
    } else {
      dispatch({ type: UPDATE_GPS_ACCURACY, payload: true });
      setGPSAlert(null);
    }
  };

  useEffect(() => {
    if (gps) {
      timeout.current = setTimeout(() => {
        toastMessage.error("GPS accuracy is not enough. Please try again.")
        navigation.reset({index: 0, routes: [{name: Routes.profile}]})

        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
      }, 3000 * 10);
    } else {
      clearTimeout(timeout?.current);
      timeout = null;
    }
  }, [gps]);

  const startAccuracyHandler = (accuracy) => {
    if (accuracy > 15) {
      dispatch({ type: UPDATE_START_ACCURACY, payload: false });
      setGPSStartAlert({
        svg: <GPSSearch />,
        title: "GPS Searching",
        content: "Please be in the open area where the GPS will capture. This process can take up to 30 seconds.",
      });
    } else if (accuracy <= 15) {
      waitGPS.current = false;
      setGPS(false);
      dispatch({ type: UPDATE_START_ACCURACY, payload: true });
      setGPSStartAlert(null);
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
      >
        <RotationLine
          degree={degree}
          setAlert={setRotateAlert}
          rotateAlert={rotateAlert}
        />
        <CameraFrame navigation={navigation} />
        <CameraProjectInfo navigation={navigation} />
        {GPSAlert && !GPSStartAlert ? (
          <CameraAlert
            svg={GPSAlert.svg}
            title={GPSAlert.title}
            content={GPSAlert.content}
          />
        ) : null}
        {GPSStartAlert && (
          <CameraAlert
            svg={GPSStartAlert.svg}
            title={GPSStartAlert.title}
            content={GPSStartAlert.content}
          />
        )}
        {rotateAlert && !GPSStartAlert ? (
          <CameraAlert
            svg={rotateAlert.svg}
            title={rotateAlert.title}
            content={rotateAlert.content}
          />
        ) : null}
        {batteryAlert && !GPSStartAlert ? (
          <CameraAlert
            svg={batteryAlert.svg}
            title={batteryAlert.title}
            content={batteryAlert.content}
          />
        ) : null}
        {mockedAlert && !GPSStartAlert ? (
          <CameraAlert
            svg={mockedAlert.svg}
            title={mockedAlert.title}
            content={mockedAlert.content}
          />
        ) : null}
        {speedAlert && !GPSStartAlert ? (
          <CameraAlert
            svg={speedAlert.svg}
            title={speedAlert.title}
            content={speedAlert.content}
          />
        ) : null}
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
