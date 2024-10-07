import {
  UPDATE_DISTANCE_BETWEEN,
  UPDATE_SELECTED_PROJECT,
  UPDATE_AUTOCAPTURE_START,
  UPDATE_LOW_RESOLUTION, UPDATE_DEFAULT_STORAGE,
} from '../../actionsName';

const INITIAL_STATE = {
  distanceBetween: 5,
  autoCaptureStart: false,
  lowResolution: false,
  selectedProject: {type: "individual", key: 0, projectName: ""},
  defaultStoragePath: "internal", // this state change only in android devices
};

const settingsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_DISTANCE_BETWEEN:
      return {
        ...state,
        distanceBetween: action.payload,
      };
    case UPDATE_SELECTED_PROJECT:
      return {
        ...state,
        selectedProject: action.payload,
      };
    case UPDATE_AUTOCAPTURE_START:
      return {
        ...state,
        autoCaptureStart: action.payload,
      };
    case UPDATE_LOW_RESOLUTION:
      return {
        ...state,
        lowResolution: action.payload,
      };
    case UPDATE_DEFAULT_STORAGE:
      return {
        ...state,
        defaultStoragePath: action.payload,
      };
    default:
      return state;
  }
};

export default settingsReducer;
