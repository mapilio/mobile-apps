import React, {useEffect, useRef, useState} from "react";
import {Camera as ExpoCamera} from "expo-camera";
import * as ScreenOrientation from "expo-screen-orientation";
import {Alert, Linking, Platform, StatusBar} from "react-native";
import {Routes} from "../navigator/Routes";
import CameraFrame from "./CameraFrame";
import CameraAlert from "./CameraAlert";
import CameraProjectInfo from "./CameraProjectInfo";
import {Accelerometer} from "expo-sensors";
import RotationLine from "./RotationLine";
import * as Location from "expo-location";
import {
    CAMERA_REDUCER_RESET,
    UPDATE_AUTOCAPTURE_START,
    UPDATE_CAMERA_REF,
    UPDATE_CAMERA_STATUS,
    UPDATE_GPS_ACCURACY,
    UPDATE_START_ACCURACY,
} from "../store/actionsName";
import {useDispatch, useSelector} from "react-redux";
import {BadGPS, BatteryLevelIcon, GPSSearch, InternetAccessIcon,} from "../assets/svg/illustrations";
import {RFValue} from "react-native-responsive-fontsize";
import {toastGenerator} from "../helper/helper";
import {errorAlertStyles} from "../styles/alertStyles";

const Camera = ({navigation}) => {
    const [degree, setDegree] = useState(0);
    const [cameraPermission, setCameraPermission] = useState(false)
    const [locationPermission, setlocationPermission] = useState(false)
    const [batteryAlert, setBatteryAlert] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [networkAlert, setNetworkAlert] = useState(null);
    const [GPSAlert, setGPSAlert] = useState(null);
    const [GPSStartAlert, setGPSStartAlert] = useState(null);
    const [rotateAlert, setRotateAlert] = useState(null);
    const [locationFeatures, setLocation] = useState({});
    const dispatch = useDispatch();
    const {batteryLevel} = useSelector((state) => state.cameraReducer);
    const {connection} = useSelector((state) => state.generalReducer);
    const cameraRef = useRef(null);
    let location = null;
    let waitGPS = true
    let accelerometerSubscription = null;

    useEffect(() => {
        const unsubscribe = navigation.addListener("blur", (e) => {
            dispatch({type: CAMERA_REDUCER_RESET});
            dispatch({type: UPDATE_AUTOCAPTURE_START, payload: false});
            waitGPS = true
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async (e) => {
            await _getCameraPermission();
            await _startNetworkProvider();
            StatusBar.setHidden(true);
            ScreenOrientation.unlockAsync()
        });
        return () => unsubscribe();
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async (e) => {
            const currentOrientation = await ScreenOrientation.getOrientationLockAsync()
            // 7 EQUAL TO LANDSCAPE_RIGHT
            if (currentOrientation !== 7) {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)
            }
        });
        return () => unsubscribe();
    }, [navigation])

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
                    svg: <BatteryLevelIcon/>,
                    title: "Battery level low",
                    content:
                        "GPS accuracy will decrease because your charge is below 20%. In this case, shooting is not possible.",
                })
                : setBatteryAlert(null);
        } else if (Platform.OS === "android") {
            batteryLevel <= 15
                ? setBatteryAlert({
                    svg: <BatteryLevelIcon/>,
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
                svg: <InternetAccessIcon/>,
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
        subscription && subscription.remove();
        accelerometerSubscription && accelerometerSubscription.remove();
        setSubscription(null);
    };

    const __startCamera = async () => {
        const {status} = await ExpoCamera.requestCameraPermissionsAsync();
        if (status === "granted") {
            return false
        } else {
            alertHandler();
            navigation.navigate(Routes.profile)
        }
    };

    const _startNetworkProvider = async () => {
        const {status} = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
            return false
        } else {
            alertHandler();
            navigation.navigate(Routes.profile())
        }
        Location.enableNetworkProviderAsync()
            .then((res) => res)
            .catch((err) => err);
    };

    const alertHandler = () => {
        Alert.alert(
            "Your some permissions is turned off",
            "Please give permissions to use the camera.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                    onPress: () => navigation.navigate(Routes.profile),
                },
                {
                    text: "Go to settings",
                    onPress: () => {
                        if (!locationPermission || !cameraPermission) {
                            console.log(locationPermission, cameraPermission)
                            navigation.navigate(Routes.profile)
                            Platform.OS === "ios"
                                ? Linking.openURL("app-settings:")
                                : Linking.openSettings()
                        }
                    }
                },
            ]
        );
    };

    useEffect(() => {
        _getCameraPermission();
    }, []);

    const _getCameraPermission = async () => {
        const permission = await ExpoCamera.getCameraPermissionsAsync();
        if (permission.status === "granted") {
            __startCamera()
            setCameraPermission(true)
        } else {
            alertHandler()
            setCameraPermission(false)
            navigation.navigate(Routes.profile)
        }
    };

    const _subscribeProvider = async () => {
        const {status} = await Location.getForegroundPermissionsAsync();
        if (status === "granted") {
            setlocationPermission(true)
            location = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 0,
                },
                (location) => {
                    if (waitGPS) {
                        startAccuracyHandler(location.coords.accuracy)
                    }
                    accuracyHandler(location.coords.accuracy);
                    setLocation(location.coords);
                }
            );
        } else {
            setlocationPermission(false)
            navigation.navigate(Routes.profile)
            alertHandler();
        }
    };

    const accuracyHandler = (accuracy) => {
        if (accuracy > 50) {
            dispatch({type: UPDATE_GPS_ACCURACY, payload: false});
            setGPSAlert({
                svg: <BadGPS width={RFValue(34)} height={RFValue(30)}/>,
                title: "GPS accuracy is too low",
                content: "Shooting will continue when the GPS alert icon turns green.",
            });
        } else {
            dispatch({type: UPDATE_GPS_ACCURACY, payload: true});
            setGPSAlert(null);
        }
    };

    useEffect(() => {
        let timeout = null
        if (waitGPS) {
            timeout = setTimeout(() => {
                toastGenerator(
                    "GPS accuracy is not enough. Please try again.",
                    require("../assets/images/Info.png"),
                    errorAlertStyles.alertContainer,
                    errorAlertStyles.alertTitle,
                    errorAlertStyles.alertImage,
                    5000
                );
                navigation.navigate(Routes.profile)
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
            }, 3000 * 10)
        } else {
            timeout = null
        }
        return () => {
            clearTimeout(timeout)
        }
    }, [waitGPS])

    const startAccuracyHandler = (accuracy) => {
        if (accuracy > 15) {
            dispatch({type: UPDATE_START_ACCURACY, payload: false});
            setGPSStartAlert({
                svg: <GPSSearch/>,
                title: "GPS Searching",
                content: "Please be in the open area where the GPS will capture. This process can take up to 30 seconds.",
            });
        } else if (accuracy <= 15) {
            waitGPS = false
            dispatch({type: UPDATE_START_ACCURACY, payload: true});
            setGPSStartAlert(null);
        }
    };

    const _removeLocationProvider = async () => {
        await location.remove();
    };

    const onCameraReady = () => {
        dispatch({type: UPDATE_CAMERA_STATUS, payload: "READY"});
        dispatch({type: UPDATE_CAMERA_REF, payload: cameraRef.current});
    };

    // TODO EDIT ALERT LOGIC
    return (
        <ExpoCamera
            style={{
                flex: 1,
                position: "relative",
            }}
            ref={cameraRef}
            onCameraReady={onCameraReady}
        >
            <RotationLine degree={degree} setAlert={setRotateAlert}/>
            <CameraFrame/>
            <CameraProjectInfo/>
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
            {rotateAlert && !GPSStartAlert ?
                (
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
        </ExpoCamera>
    );
};

export default Camera;
