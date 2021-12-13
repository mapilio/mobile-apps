import React, { useEffect, useRef, useState } from "react";
import { Camera as ExpoCamera } from "expo-camera";
import * as ScreenOrientation from "expo-screen-orientation";
import { Alert, Linking, Platform, StatusBar } from "react-native";
import { Routes } from "../navigator/Routes";
import CameraFrame from "./CameraFrame";
import CameraAlert from "./CameraAlert";
import CameraProjectInfo from "./CameraProjectInfo";
import { Accelerometer } from "expo-sensors";
import RotationLine from "./RotationLine";
import * as Location from "expo-location";
import {
  UPDATE_CAMERA_REF,
  UPDATE_CAMERA_STATUS,
  UPDATE_GPS_ACCURACY,
  UPDATE_GPS_STATUS,
} from "../store/actionsName";
import { useDispatch } from "react-redux";
import {
  BadGPS,
  BatteryLevelIcon,
  GPSError,
  InternetAccessIcon,
} from "../assets/svg/illustrations";
import { useSelector } from "react-redux";
import { RFValue } from "react-native-responsive-fontsize";

const Camera = ({ navigation }) => {
  const [degree, setDegree] = useState(0);
  const [batteryAlert, setBatteryAlert] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [networkAlert, setNetworkAlert] = useState(null);
  const [GPSAlert, setGPSAlert] = useState(null);
  const [rotateAlert, setRotateAlert] = useState(null);
  const [locationFeatures, setLocation] = useState({});
  const dispatch = useDispatch();
  const { batteryLevel } = useSelector((state) => state.cameraReducer);
  const { connection } = useSelector((state) => state.generalReducer);
  const cameraRef = useRef(null);
  let location = null;
  let accelerometerSubscription = null;

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", (e) => {
      StatusBar.setHidden(false);
      ScreenOrientation.unlockAsync();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", (e) => {
      __startCamera();
      _startNetworkProvider();
      StatusBar.setHidden(true);
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
      );
    });
    return unsubscribe;
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

  useEffect(() => {
    if (locationFeatures.accuracy > 1) {
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
  }, [locationFeatures, dispatch]);

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
    accelerometerSubscription && accelerometerSubscription.remove();
    setSubscription(null);
  };

  const __startCamera = async () => {
    const { status } = await ExpoCamera.requestCameraPermissionsAsync();
    if (status === "granted") {
      // todo something
    } else {
      // alertHandler();
    }
  };

  const _startNetworkProvider = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      // todo something
    } else {
      alertHandler();
    }
    Location.enableNetworkProviderAsync()
      .then((res) => res)
      .catch((err) => err);
  };

  const alertHandler = () => {
    Alert.alert(
      "Your camera permission is turned off",
      "Please give permission to use the camera.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => navigation.navigate(Routes.profile),
        },
        {
          text: "Go to settings",
          onPress: async () =>
            Platform.OS === "ios"
              ? Linking.openURL("app-settings:")
              : Linking.openSettings(),
        },
      ]
    );
  };

  useEffect(() => {
    _getCameraPermission();
  }, []);

  const _getCameraPermission = async () => {
    const permission = await ExpoCamera.getCameraPermissionsAsync();
    if (permission.status === "granted") return;
    alertHandler();
  };

  const _subscribeProvider = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === "granted") {
      location = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Lowest,
          // timeInterval: 0,
          // distanceInterval: 0,
        },
        async (location) => {
          // console.log(location);
          if (Platform.OS === "android") {
          }
          setLocation(location.coords);
        }
      );
    } else {
      alertHandler();
    }
  };

  const _removeLocationProvider = async () => {
    await location.remove();
  };

  const onCameraReady = () => {
    dispatch({ type: UPDATE_CAMERA_STATUS, payload: "READY" });
    dispatch({ type: UPDATE_CAMERA_REF, payload: cameraRef.current });
  };

  return (
    <>
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
        <CameraProjectInfo />
        {GPSAlert && (
          <CameraAlert
            svg={GPSAlert.svg}
            title={GPSAlert.title}
            content={GPSAlert.content}
          />
        )}
        {rotateAlert && !GPSAlert ? (
          <CameraAlert
            svg={rotateAlert.svg}
            title={rotateAlert.title}
            content={rotateAlert.content}
          />
        ) : null}
        {batteryAlert && (
          <CameraAlert
            svg={batteryAlert.svg}
            title={batteryAlert.title}
            content={batteryAlert.content}
          />
        )}
        {networkAlert && (
          <CameraAlert
            svg={networkAlert.svg}
            title={networkAlert.title}
            content={networkAlert.content}
          />
        )}
      </ExpoCamera>
    </>
  );
};

export default Camera;
