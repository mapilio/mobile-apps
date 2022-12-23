import {StatusBar, View} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {
  BadGPS,
  BatteryLevelIcon,
  CameraRotate,
  GPSSearch,
  HighSpeedIcon,
  MockedIcon
} from "../assets/svg/illustrations";
import {CustomText} from "../highordercomponents";
import {cameraAlertStyles} from "../styles/cameraStyles";
import {store} from "../store/store";
import {
  CAMERA_REDUCER_RESET,
  UPDATE_AUTOCAPTURE_START,
  UPDATE_PHOTO_AMOUNT,
  UPDATE_SELECTED_PROJECT,
  UPDATE_UUID
} from "../store/actionsName";
import uuid from "react-native-uuid";
import * as ScreenOrientation from "expo-screen-orientation";

const Alert = ({svg, title, content}) => {
  return (
    <View style={cameraAlertStyles.container}>
      <View style={cameraAlertStyles.card}>
        {svg}
        <CustomText
          style={cameraAlertStyles.title}
        >
          {title}
        </CustomText>
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
        title={"Battery level low"}
        content={"GPS accuracy will decrease because your charge is below 20%. In this case, shooting is not possible."}
      />
    );
  },
  mocked: () => {
    return (
      <Alert
        svg={<MockedIcon/>}
        title={"Fake GPS"}
        content={"Fake gps usage has been detected, please use device gps location to proceed!"}
      />
    )
  },
  highSpeed: () => {
    return (
      <Alert
        svg={<HighSpeedIcon/>}
        title={"High speed"}
        content={"You exceeded the high speed limit. For precision, your speed should be a maximum of 70km/h."}
      />
    )
  },
  gpsAlert: () => {
    return (
      <Alert
        svg={<BadGPS width={RFValue(34)} height={RFValue(30)}/>}
        title={"GPS accuracy is too low"}
        content={"Shooting will continue when the GPS alert icon turns green."}
      />
    )
  },
  gpsStartAlert: () => {
    return (
      <Alert
        svg={<GPSSearch/>}
        title={"GPS Searching"}
        content={"Please be in the open area where the GPS will capture. This process can take up to 30 seconds."}
      />
    )
  },
  rotate: () => {
    return (
      <Alert
        svg={<CameraRotate/>}
        title={"Adjust your camera angle"}
        content={"Shooting will continue when the your rotation true."}
      />
    )
  }
}

export const CameraWarnings = () => {
  const cameraReducers = store.getState().cameraReducer

  const setAlert = () => {
    if (!cameraReducers.GPSAccuracy) {
      return cameraAlerts.gpsAlert()
    } else if (cameraReducers.rotateStatus) {
      return cameraAlerts.rotate()
    } else if (cameraReducers.batteryStatus) {
      return cameraAlerts.battery()
    } else if (cameraReducers.mocked) {
      return cameraAlerts.mocked()
    } else if (cameraReducers.highSpeed) {
      return cameraAlerts.highSpeed()
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

export const setNewUUID = () => {
  store.dispatch({ type: UPDATE_UUID, payload: uuid.v4() });
  store.dispatch({ type: UPDATE_PHOTO_AMOUNT, payload: 0 });
}

export const exitCapture = () => {
  ScreenOrientation.unlockAsync().then(() => ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP));
  StatusBar.setHidden(false);
  store.dispatch({type: UPDATE_PHOTO_AMOUNT, payload: 0});
  store.dispatch({type: CAMERA_REDUCER_RESET});
  store.dispatch({type: UPDATE_SELECTED_PROJECT, payload: {type: "individual", key: 0}});
  store.dispatch({type: UPDATE_AUTOCAPTURE_START, payload: false});
}
