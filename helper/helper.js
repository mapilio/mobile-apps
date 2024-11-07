import {store} from "../store/store";
import axios from "axios";
import {Alert, Dimensions, Linking, Platform} from "react-native";
import Moment from "moment";
// import {check, PERMISSIONS, request, requestMultiple, RESULTS} from "react-native-permissions";
import {tabHeight} from "../util/consts/ui";
import i18next from "i18next";

let isOpenOnce = false;
Moment.suppressDeprecationWarnings = true;

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

/**
 * @deprecated
 */
const fetchHandler = ({ ...args } = {}) => {
  const auth = store.getState().getTokenReducer.auth;
  auth && (axios.defaults.headers.common["Authorization"] = `Bearer ${auth.access_token || auth.token}`);

  return axios(args).then((response) => response.data);
};

const thousandFormatter = (num, shortCode = "k") => {
  const formatted = Math.abs(num).toFixed(1);
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + shortCode
    : formatted.endsWith(".0") ? Math.abs(num).toFixed(0) : (Math.sign(num) * Math.abs(num)).toFixed(1)
};

const maxCharacterHandler = (text, maxLength) => {
 try {
   if (text.length > maxLength) text = text.substring(0, maxLength) + "...";
 } catch {
   return " ";
 }
  return text;
};

const initialPermissions = () => {
  const permission = Platform.OS === "ios" ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION

  return new Promise((resolve, reject) => {
    check(permission).then((status) => {
      if (status !== RESULTS.GRANTED) {
        request(permission).then(() => resolve(status))
      } else {
        resolve(status)
      }
    }).catch((error) => {
      reject(error)
    })
  })
}

const cameraPermission = (onPress) => {
  const permissions = Platform.OS === 'ios' ?
    [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] :
    [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, PERMISSIONS.ANDROID.CAMERA]

  requestMultiple(permissions).then((stat) => {
    if (stat[permissions[0]] !== RESULTS.GRANTED) {
      alertHandler("Mapilio needs access to the camera before you can capture photos. Go to your settings to enable.");
    } else if (stat[permissions[1]] !== RESULTS.GRANTED) {
      alertHandler("Mapilio needs access to the location before you can capture photos. Go to your settings to enable.");
    } else {
      onPress()
    }
  })
}

const galleryPermission = async () => {

  if (Platform.OS === 'android') {
    return RESULTS.GRANTED;
  }

  const status = await request(PERMISSIONS.IOS.PHOTO_LIBRARY)

  if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
    return RESULTS.GRANTED;
  }

  throw new Error('We need photo gallery access so you can update your profile photo.')
}

const alertHandler = (alertText) => {
  if (!isOpenOnce) {
    isOpenOnce = true;
    Alert.alert("No access to camera", alertText, [
      {
        text: "Go to settings",
        style: "cancel",
        onPress: () => {
          isOpenOnce = false;
          Platform.OS === "ios" ? Linking.openURL("app-settings:") : Linking.openSettings();
        },
      },
      {
        text: Platform.OS === "ios" ? "Continue" : "Contınue",
        onPress: () => {
          isOpenOnce = false;
        },
      },
    ]);
  }
};

const dateConvert = (datetime, format = "MMM D, YYYY") => {
  if (!Moment(datetime).isValid()) {
    const parsedDatetime = datetime
      .split(" ")
      .map((time, i) => (i === 0 ? time.split(":").join("/") : time));
    return Moment(new Date(parsedDatetime.join(" "))).locale(i18next.resolvedLanguage).format(format);
  }
  return Moment(datetime).locale(i18next.resolvedLanguage).format(format);
};

const headingPointGeoJson = (heading, coordinates) => {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          rotate: Number(heading),
        },
        geometry: {
          type: "Point",
          coordinates: coordinates,
        },
      },
    ],
  };
};

/**
 *
 * Getting area height outside bottom bar and top bar
 *
 * @param top {number} Tob bar height
 * @param bottom {number} Bottom bar height
 * @returns {number} content height
 */
const getContentAreaHeight = (top, bottom) => Dimensions.get('window').height - tabHeight - top - bottom


export {
  convertHexToRGBA,
  fetchHandler,
  maxCharacterHandler,
  thousandFormatter,
  dateConvert,
  headingPointGeoJson,
  getContentAreaHeight,
  initialPermissions,
  cameraPermission,
  galleryPermission
};
