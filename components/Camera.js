import React, { useEffect, useRef, useState } from "react";
import { Camera as ExpoCamera } from "expo-camera";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  ActivityIndicator,
  Animated,
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
import {
  CAMERA_REDUCER_RESET,
  UPDATE_AUTOCAPTURE_START,
  UPDATE_CAMERA_REF,
  UPDATE_CAMERA_STATUS,
  UPDATE_GPS_ACCURACY,
  UPDATE_SELECTED_PROJECT,
  UPDATE_START_ACCURACY,
  UPDATE_MOCKED_STATUS,
  UPDATE_HIGHSPEED_STATUS,
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
import { permissionHandler, toastGenerator } from "../helper/helper";
import { errorAlertStyles } from "../styles/alertStyles";
import { CustomTextMedium } from "../highordercomponents";

const Camera = ({ navigation }) => {
  const [degree, setDegree] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [batteryAlert, setBatteryAlert] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [mockedAlert, setMockedAlert] = useState(null);
  const [speedAlert, setSpeedAlert] = useState(null);
  const [networkAlert, setNetworkAlert] = useState(null);
  const [GPSAlert, setGPSAlert] = useState(null);
  const [GPSStartAlert, setGPSStartAlert] = useState(null);
  const [rotateAlert, setRotateAlert] = useState(null);
  const [gps, setGPS] = useState(true);
  const fadeAnimation = useRef(new Animated.Value(0.7)).current;
  const dispatch = useDispatch();
  const { batteryLevel } = useSelector((state) => state.cameraReducer);
  const { connection } = useSelector((state) => state.generalReducer);
  const cameraRef = useRef(null);
  let timeout = null;
  let location = null;
  let waitGPS = true;
  let accelerometerSubscription = null;

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", (e) => {
      setCameraReady(false);
      waitGPS = true;
      clearTimeout(timeout);
      dispatch({ type: UPDATE_AUTOCAPTURE_START, payload: false });
      timeout = null;
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async (e) => {
      setCameraReady(true);
      await permissionHandler(false, goProfile);
      await _startNetworkProvider();
      StatusBar.setHidden(true);
    });
    return () => unsubscribe();
  }, [navigation]);

  const goProfile = () => navigation.navigate(Routes.profile);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async (e) => {
      const currentOrientation =
        await ScreenOrientation.getOrientationLockAsync();
      // 7 EQUAL TO LANDSCAPE_RIGHT
      if (currentOrientation !== 7) {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
        );
      }
    });
    return () => unsubscribe();
  }, [navigation]);

  useEffect(() => {
    _subscribeToAccelerometer();
    return () => _removeAccelerometerSubscribe();
  }, []);

  useEffect(() => {
    _subscribeProvider();
    return () => _removeLocationProvider();
  }, []);

  useEffect(() => {
    if (Platform.OS === "ios") {
      batteryLevel <= 20
        ? setBatteryAlert({
            svg: <BatteryLevelIcon />,
            title: "Battery level low",
            content:
              "GPS accuracy will decrease because your charge is below 20%. In this case, shooting is not possible.",
          })
        : setBatteryAlert(null);
    } else if (Platform.OS === "android") {
      batteryLevel <= 15
        ? setBatteryAlert({
            svg: <BatteryLevelIcon />,
            title: "Battery level low",
            content:
              "GPS accuracy will decrease because your charge is below 15%. In this case, shooting is not possible.",
          })
        : setBatteryAlert(null);
    }
  }, [batteryLevel]);

  useEffect(() => {
    if (!connection.connectionStatus) {
      setNetworkAlert({
        svg: <InternetAccessIcon />,
        title: "You do not have an internet connection",
        content:
          "You do not have an internet connection. Make sure mobile cellular data of wifi is turned on.",
      });
    } else {
      setNetworkAlert(null);
    }
  }, [connection]);

  const _subscribeToAccelerometer = () => {
    accelerometerSubscription = Accelerometer.addListener(
      (accelerometerData) => {
        let x = accelerometerData.x;
        let y = accelerometerData.y;
        let degree = (Math.atan2(y, x) * 180) / Math.PI;
        setDegree(degree);
        return accelerometerData;
      }
    );
    setSubscription(accelerometerSubscription);
  };

  const _removeAccelerometerSubscribe = () => {
    subscription?.remove();
    accelerometerSubscription?.remove();
    setSubscription(null);
  };

  const _startNetworkProvider = async () => {
    await Location.enableNetworkProviderAsync()
      .then((res) => res)
      .catch((err) => err);
  };

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
        if (gps && waitGPS) {
          startAccuracyHandler(location.coords.accuracy);
        }
        accuracyHandler(location.coords.accuracy);
      }
    );
  };

  const accuracyHandler = (accuracy) => {
    if (accuracy > 35) {
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

  const _removeLocationProvider = async () => {
    await location?.remove();
  };

  useEffect(() => {
    if (gps) {
      timeout = setTimeout(() => {
        toastGenerator(
          "GPS accuracy is not enough. Please try again.",
          require("../assets/images/Info.png"),
          errorAlertStyles.alertContainer,
          errorAlertStyles.alertTitle,
          errorAlertStyles.alertImage,
          5000
        );
        navigation.navigate(Routes.profile);
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
      }, 3000 * 10);
    } else {
      clearTimeout(timeout);
      timeout = null;
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [gps]);

  const startAccuracyHandler = (accuracy) => {
    if (accuracy > 15) {
      dispatch({ type: UPDATE_START_ACCURACY, payload: false });
      setGPSStartAlert({
        svg: <GPSSearch />,
        title: "GPS Searching",
        content:
          "Please be in the open area where the GPS will capture. This process can take up to 30 seconds.",
      });
    } else if (accuracy <= 15) {
      waitGPS = false;
      setGPS(false);
      dispatch({ type: UPDATE_START_ACCURACY, payload: true });
      setGPSStartAlert(null);
    }
  };

  const onCameraReady = () => {
    dispatch({ type: UPDATE_CAMERA_STATUS, payload: "READY" });
    dispatch({ type: UPDATE_CAMERA_REF, payload: cameraRef.current });
  };

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 0,
      duration: 1300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);

  if (cameraReady) {
    return (
      <ExpoCamera
        style={{
          flex: 1,
          position: "relative",
        }}
        ref={cameraRef}
        onCameraReady={onCameraReady}
      >
        <RotationLine degree={degree} setAlert={setRotateAlert} />
        <CameraFrame />
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
        {networkAlert && !GPSStartAlert ? (
          <CameraAlert
            svg={networkAlert.svg}
            title={networkAlert.title}
            content={networkAlert.content}
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
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#2E2E2E",
        }}
      >
        <ActivityIndicator size={"large"} color={"#FFFFFF"} />
        <CustomTextMedium
          style={{
            fontSize: RFValue(16),
            marginTop: RFValue(30),
            color: "#FFFFFF",
          }}
        >
          Camera is getting ready. Please wait.
        </CustomTextMedium>
      </View>
    );
  }
};

export default Camera;
