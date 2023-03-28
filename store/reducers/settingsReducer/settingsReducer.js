import {
  UPDATE_DISTANCE_BETWEEN,
  UPDATE_SELECTED_PROJECT,
  UPDATE_AUTOCAPTURE_START,
  DEBUG_MODE
} from "../../actionsName";

const INITIAL_STATE = {
  distanceBetween: 5,
  autoCaptureStart: false,
  selectedProject: {type: "individual", key: 0, projectName: ""},
  debugMode: false
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
    case DEBUG_MODE:
      return {
        ...state,
        debugMode: action.payload,
      };
    default:
      return state;
  }
};

export default settingsReducer;
