import React, { useEffect, useRef, useState } from "react";
import { Camera as ExpoCamera } from "expo-camera";
import * as ScreenOrientation from "expo-screen-orientation";
import { Alert, Linking, Platform, StatusBar } from "react-native";
import { Routes } from "../navigator/Routes";
import CameraFrame from "./CameraFrame";
import CameraInfos from "./CameraInfos";
import CameraAlert from "./CameraAlert";
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
import { GPSError } from "../assets/svg/illustrations";

const Camera = ({ navigation }) => {
  const [degree, setDegree] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [GPSAlert, setGPSAlert] = useState(null);
  const [rotateAlert, setRotateAlert] = useState(null);
  const [locationFeatures, setLocation] = useState({});
  const dispatch = useDispatch();
  const cameraRef = useRef(null);
  let location = null;

  useEffect(() => {
    __startCamera();
    _startNetworkProvider();
    StatusBar.setHidden(true);
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
    );
  }, []);

  useEffect(() => {
    _subscribeProvider();
    return () => _removeLocationProvider();
  }, []);

  useEffect(() => {
    if (locationFeatures.accuracy > 5) {
      dispatch({ type: UPDATE_GPS_ACCURACY, payload: false });
      setGPSAlert({
        svg: <GPSError />,
        title: "GPS accuracy is too low",
        content: "Shooting will continue when the GPS alert icon turns green.",
      });
    } else {
      dispatch({ type: UPDATE_GPS_ACCURACY, payload: true });
      setGPSAlert(null);
    }
  }, [locationFeatures, dispatch]);

  useEffect(() => {
    const GPSInterval = setInterval(async () => {
      const status = await Location.hasServicesEnabledAsync();
      dispatch({ type: UPDATE_GPS_STATUS, payload: status });
    }, 1000);
    return () => clearInterval(GPSInterval);
  }, []);

  const _subscribeToAccelerometer = () => {
    setSubscription(
      Accelerometer.addListener((accelerometerData) => {
        let x = accelerometerData.x;
        let y = accelerometerData.y;
        let degree = (Math.atan2(y, x) * 180) / Math.PI;
        setDegree(degree);
        return accelerometerData;
      })
    );
  };

  const _removeAccelerometerSubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const __startCamera = async () => {
    const { status } = await ExpoCamera.requestCameraPermissionsAsync();
    if (status === "granted") {
      // todo something
    } else {
      alertHandler();
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
      // todo something
    } else {
      alertHandler();
    }
    setInterval(async () => {
      location = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Lowest,
          // timeInterval: 0,
          // distanceInterval: 0,
        },
        async (location) => {
          if (Platform.OS === "android") {
            // console.log(location);
          }
          setLocation(location.coords);
        }
      );
    }, 1000);
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
        <CameraInfos />
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
      </ExpoCamera>
    </>
  );
};

export default Camera;
