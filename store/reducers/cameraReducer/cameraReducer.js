import {
  UPDATE_GPS_ACCURACY,
  UPDATE_GPS_STATUS,
  UPDATE_CAMERA_STATUS,
  UPDATE_CAMERA_REF,
  UPDATE_IMAGE_SIZE,
  UPDATE_CAPTURE_TYPE,
  UPDATE_PHONE_MEMORY,
  UPDATE_PHOTO_AMOUNT,
  UPDATE_BATTERY_LEVEL,
} from "../../actionsName";

const INITIAL_STATE = {
  GPSAccuracy: true,
  GPSStatus: true,
  cameraStatus: "",
  camera: null,
  imageSize: 3145728,
  phoneMemory: 0,
  photoAmount: 0,
  batteryLevel: 100,
  captureType: "manuel",
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
    case UPDATE_CAPTURE_TYPE:
      return {
        ...state,
        captureType: action.payload,
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
    default:
      return state;
  }
};

export default cameraReducer;
