import {
  UPDATE_DISTANCE_BETWEEN,
  UPDATE_SELECTED_PROJECT,
  UPDATE_AUTOCAPTURE_START,
} from "../../actionsName";

const INITIAL_STATE = {
  distanceBetween: 5,
  autoCaptureStart: false,
  selectedProject: { type: "individual", key: 0, projectName: "" }
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
    default:
      return state;
  }
};

export default settingsReducer;
