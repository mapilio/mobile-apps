import {
  UPDATE_GPS_ACCURACY,
  UPDATE_GPS_STATUS,
  UPDATE_CAMERA_STATUS,
  UPDATE_CAMERA_REF,
  UPDATE_IMAGE_SIZE,
  UPDATE_PHONE_MEMORY,
  UPDATE_PHOTO_AMOUNT,
  UPDATE_BATTERY_LEVEL,
  UPDATE_START_ACCURACY,
  UPDATE_MOCKED_STATUS,
  UPDATE_HIGHSPEED_STATUS,
  CAMERA_REDUCER_RESET,
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
  mocked: false,
  highSpeed: false,
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
        batteryLevel: 100,
      };
    default:
      return state;
  }
};

export default cameraReducer;
