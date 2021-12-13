import * as Font from "expo-font";
import { store } from "../store/store";
import { Notifier, NotifierComponents } from "react-native-notifier";
import axios from "axios";
import { StatusBar } from "react-native";

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

const toastGenerator = (
  title,
  image,
  containerStyle,
  titleStyle,
  imageStyle,
  duration = 0
) =>
  Notifier.showNotification({
    title: title,
    Component: NotifierComponents.Notification,
    swipeEnabled: true,
    duration: duration,
    translucentStatusBar: StatusBar.currentHeight,
    componentProps: {
      //Todo xd export alert images with low quality.
      imageSource: image,
      imageStyle: imageStyle,
      titleStyle: titleStyle,
      containerStyle: containerStyle,
    },
  });

const maxCharacterHandler = (text, maxLength) => {
  if (text.length > maxLength) text = text.substring(0, maxLength) + "...";
  return text;
};

export {
  useFonts,
  convertHexToRGBA,
  fetchHandler,
  toastGenerator,
  maxCharacterHandler,
};
