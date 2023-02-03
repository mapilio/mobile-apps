import {
  UPDATE_GPS_ACCURACY,
  UPDATE_GPS_STATUS,
  UPDATE_CAMERA_STATUS,
  UPDATE_CAMERA_REF,
  UPDATE_IMAGE_SIZE,
  UPDATE_PHONE_MEMORY,
  UPDATE_PHOTO_AMOUNT,
  UPDATE_BATTERY_LEVEL,
  UPDATE_BATTERY_STATUS,
  UPDATE_START_ACCURACY,
  UPDATE_MOCKED_STATUS,
  UPDATE_HIGHSPEED_STATUS,
  UPDATE_CHARGE_STATUS,
  UPDATE_UUID,
  CAMERA_REDUCER_RESET,
  UPDATE_ACCURACY,
  CAPTURE_BUTTON_STATUS,
  UPDATE_ROTATE_STATUS,
  SET_CAMERA_LOCATION,
  UPDATE_OPENED_STATUS,
  IS_ACTIVE,
  GROUP_ID,
} from "../../actionsName";

const INITIAL_STATE = {
  GPSAccuracy: false,
  GPSStartAccuracy: false,
  GPSStatus: true,
  cameraStatus: "",
  camera: null,
  imageSize: 3145728,
  phoneMemory: 0,
  photoAmount: 0,
  batteryLevel: 100,
  batteryStatus: false,
  accuracy: false,
  mocked: false,
  highSpeed: false,
  keepUUID: null,
  isCharge: true,
  captureButtonStatus: false,
  rotateStatus: false,
  cameraLocation: null,
  isFirstOpen: true,
  isActive: true,
  groupId: null,
};

const cameraReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_GPS_ACCURACY:
      return {
        ...state,
        GPSAccuracy: action.payload,
      };
    case UPDATE_GPS_STATUS:
      return {
        ...state,
        GPSStatus: action.payload,
      };
    case UPDATE_CAMERA_STATUS:
      return {
        ...state,
        cameraStatus: action.payload,
      };
    case UPDATE_CAMERA_REF:
      return {
        ...state,
        camera: action.payload,
      };
    case UPDATE_IMAGE_SIZE:
      return {
        ...state,
        imageSize: action.payload,
      };
    case UPDATE_PHONE_MEMORY:
      return {
        ...state,
        phoneMemory: action.payload,
      };
    case UPDATE_PHOTO_AMOUNT:
      return {
        ...state,
        photoAmount: action.payload,
      };
    case UPDATE_BATTERY_LEVEL:
      return {
        ...state,
        batteryLevel: action.payload,
      };
    case UPDATE_BATTERY_STATUS:
      return {
        ...state,
        batteryStatus: action.payload,
      };
    case UPDATE_START_ACCURACY:
      return {
        ...state,
        GPSStartAccuracy: action.payload,
      };
    case UPDATE_HIGHSPEED_STATUS:
      return {
        ...state,
        highSpeed: action.payload,
      };
    case UPDATE_MOCKED_STATUS:
      return {
        ...state,
        mocked: action.payload,
      };
    case UPDATE_UUID:
      return {
        ...state,
        keepUUID: action.payload,
      };
    case UPDATE_CHARGE_STATUS:
      return {
        ...state,
        isCharge: action.payload,
      };
    case UPDATE_ACCURACY:
      return {
        ...state,
        accuracy: action.payload,
      };
    case CAMERA_REDUCER_RESET:
      return {
        ...state,
        GPSAccuracy: false,
        GPSStartAccuracy: false,
        GPSStatus: true,
        cameraStatus: "",
        camera: null,
        imageSize: 3145728,
        phoneMemory: 0,
        photoAmount: 0,
      };
    case CAPTURE_BUTTON_STATUS:
      return {
        ...state,
        captureButtonStatus: action.payload,
      };
    case UPDATE_ROTATE_STATUS:
      return {
        ...state,
        rotateStatus: action.payload,
      };
    case SET_CAMERA_LOCATION:
      return {
        ...state,
        cameraLocation: action.payload
      };
    case UPDATE_OPENED_STATUS:
      return {
        ...state,
        isFirstOpen: action.payload
      };
    case IS_ACTIVE:
      return {
        ...state,
        isActive: action.payload
      };
    case GROUP_ID:
      return {
        ...state,
        groupId: action.payload
      };
    default:
      return state;
  }
};

export default cameraReducer;
