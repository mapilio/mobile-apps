import {
  UPDATE_GPS_ACCURACY,
  UPDATE_GPS_STATUS,
  UPDATE_CAMERA_STATUS,
  UPDATE_CAMERA_REF,
} from "../../actionsName";

const INITIAL_STATE = {
  GPSAccuracy: true,
  GPSStatus: true,
  cameraStatus: "",
  camera: null,
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
    default:
      return state;
  }
};

export default cameraReducer;
