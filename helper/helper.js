import * as Font from "expo-font";
import { store } from "../store/store";
import { Notifier, NotifierComponents } from "react-native-notifier";
import axios from "axios";
import { Alert, Linking, Platform, StatusBar } from "react-native";
import { Camera as ExpoCamera } from "expo-camera";
import * as Location from "expo-location";
import Moment from "moment";
let isOpenOnce = false;
Moment.suppressDeprecationWarnings = true;

const useFonts = async () =>
  await Font.loadAsync({
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

const convertHexToRGBA = (hexCode, opacity) => {
  let hex = hexCode.replace("#", "");

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r},${g},${b},${opacity / 100})`;
};

const fetchHandler = ({ ...args } = {}) => {
  const auth = store.getState().getTokenReducer.auth;
  auth &&
    (axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`);

  return axios(args).then((response) => response.data);
};

const kFormatter = (num) => {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
    : Math.sign(num) * Math.abs(num);
};

const toastGenerator = (
  title,
  image,
  containerStyle,
  titleStyle,
  imageStyle,
  duration = 0
) => {
  Notifier.showNotification({
    title: title,
    Component: NotifierComponents.Notification,
    swipeEnabled: true,
    duration: duration,
    translucentStatusBar: StatusBar.currentHeight,
    componentProps: {
      imageSource: image,
      imageStyle: imageStyle,
      titleStyle: titleStyle,
      containerStyle: containerStyle,
    },
  });
};

const maxCharacterHandler = (text, maxLength) => {
  if (text.length > maxLength) text = text.substring(0, maxLength) + "...";
  return text;
};

const permissionHandler = async (
  handler = () => {},
  cancelHandler = () => {},
  noAccessHandler = () => {},
  from = "location"
) => {
  const { status: cameraStatus } = await ExpoCamera.getCameraPermissionsAsync();

  const { status: locationStatus } =
    await Location.getForegroundPermissionsAsync();

  if (cameraStatus !== "granted" || locationStatus !== "granted") {
    if (cameraStatus !== "granted" && from === "camera") {
      const { status: cameraStatus } =
        await ExpoCamera.requestCameraPermissionsAsync();
      alertHandler(cameraStatus, cancelHandler);
    }
    if (locationStatus !== "granted") {
      const { status: locationStatus } =
        await Location.requestForegroundPermissionsAsync();
      alertHandler(locationStatus, cancelHandler);
    }
  } else {
    noAccessHandler();
  }
};

const alertHandler = (status, cancelHandler) => {
  // if (!isOpenOnce) {
  //   isOpenOnce = true;
  //   if (status !== "granted") {
  //     Alert.alert(
  //       "Your some permissions is turned off",
  //       "If you do not allow permissions, you will not access to capture.",
  //       [
  //         {
  //           text: "Continue",
  //           style: "cancel",
  //           onPress: () => {
  //             cancelHandler();
  //             isOpenOnce = false;
  //           },
  //         },
  //         {
  //           text: "Go to settings",
  //           onPress: () => {
  //             Platform.OS === "ios"
  //               ? Linking.openURL("app-settings:")
  //               : Linking.openSettings();
  //             isOpenOnce = false;
  //           },
  //         },
  //       ]
  //     );
  //   }
  // }
};

const dateConvert = (datetime, format = "MMM D, YYYY") => {
  if (!Moment(datetime).isValid()) {
    const parsedDatetime = datetime
      .split(" ")
      .map((time, i) => (i === 0 ? time.split(":").join("/") : time));
    return Moment(new Date(parsedDatetime.join(" "))).format(format);
  }
  return Moment(datetime).format(format);
};

const headingPointGeoJson = (heading, coordinates) => {
  return {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "rotate": Number(heading)
        },
        "geometry": {
          "type": "Point",
          "coordinates": coordinates
        }
      }
    ]
  }
}


export {
  useFonts,
  convertHexToRGBA,
  fetchHandler,
  toastGenerator,
  maxCharacterHandler,
  permissionHandler,
  kFormatter,
  dateConvert,
  headingPointGeoJson,
};
