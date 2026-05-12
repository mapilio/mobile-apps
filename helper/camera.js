import {StatusBar, View} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {
  BadGPS,
  BatteryLevelIcon,
  CameraRotate,
  GPSSearch,
  MockedIcon
} from "../assets/svg/illustrations";
import {CustomText,CustomTextMedium} from "../highordercomponents";
import {cameraAlertStyles} from "../styles/cameraStyles";
import {store} from "../store/store";
import {
  CAMERA_REDUCER_RESET,
  UPDATE_AUTOCAPTURE_START,
  UPDATE_PHOTO_AMOUNT,
  UPDATE_SELECTED_PROJECT,
} from "../store/actionsName";
import * as ScreenOrientation from "expo-screen-orientation";
import i18n from 'i18next';

const translate = (key, options) => i18n.t(key, {ns: "camera", ...options})

const Alert = ({svg, title, content}) => {
  return (
    <View style={cameraAlertStyles.container}>
      <View style={cameraAlertStyles.card}>
        {svg}
        <CustomTextMedium
          style={cameraAlertStyles.title}
        >
          {title}
        </CustomTextMedium>
        <CustomText
          style={cameraAlertStyles.content}
        >
          {content}
        </CustomText>
      </View>
    </View>
  );
};

const cameraAlerts = {
  battery: () => {
    return (
      <Alert
        svg={<BatteryLevelIcon/>}
        title={translate("warning.battery.title")}
        content={translate("warning.battery.description")}
      />
    );
  },
  mocked: () => {
    return (
      <Alert
        svg={<MockedIcon/>}
        title={translate("warning.mocked.title")}
        content={translate("warning.mocked.description")}
      />
    )
  },
  gpsAlert: () => {
    const accuracy = store.getState().cameraReducer.accuracyLevel;
    return (
      <Alert
        svg={<BadGPS width={RFValue(34)} height={RFValue(30)}/>}
        title={translate("warning.bad_gps.title")}
        content={translate("warning.bad_gps.description", {accuracy})}
      />
    )
  },
  gpsStartAlert: () => {
    return (
      <Alert
        svg={<GPSSearch/>}
        title={translate("warning.gps.title")}
        content={translate("warning.gps.description")}
      />
    )
  },
  rotate: () => {
    return (
      <Alert
        svg={<CameraRotate/>}
        title={translate("warning.angle.title")}
        content={translate("warning.angle.description")}
      />
    )
  }
}

export const CameraWarnings = () => {
  const cameraReducers = store.getState().cameraReducer

  const setAlert = () => {
    if (!cameraReducers.GPSAccuracy) {
      return cameraAlerts.gpsAlert()
    } else if (cameraReducers.rotateStatus && cameraReducers.showRotateAlert) {
      return cameraAlerts.rotate()
    } else if (cameraReducers.batteryStatus) {
      return cameraAlerts.battery()
    } else if (cameraReducers.mocked) {
      return cameraAlerts.mocked()
    }
  }

  return setAlert() ?? <></>
}

/**
 * This function calculates the degree of the device to the ground.
 *
 * @param x {number} position of X accelerometer
 * @param y {number} position of Y accelerometer
 * @returns {number}
 */
export const degreeCalculate = (x, y) => {
  return Math.floor(((Math.atan2(y, x) * (180 / Math.PI) + 90 + 360) % 360));
}

export const exitCapture = () => {
  ScreenOrientation.unlockAsync().then(() => ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP));
  StatusBar.setHidden(false);
  store.dispatch({type: UPDATE_PHOTO_AMOUNT, payload: 0});
  store.dispatch({type: CAMERA_REDUCER_RESET});
  store.dispatch({type: UPDATE_SELECTED_PROJECT, payload: {type: "individual", key: 0}});
  store.dispatch({type: UPDATE_AUTOCAPTURE_START, payload: false});
}
