import {
  ACTIVE_SEQUENCE,
  PROGRESS, UPLOAD_DATA
} from "../../actionsName";

const INITIAL_STATE = {
  progress: 0,
  uploadData: [],
  activeSequence: '',
};

const uploadReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PROGRESS:
      return {
        ...state,
        progress: action.payload,
      };
    case UPLOAD_DATA:
      return {
        ...state,
        uploadData: action.payload,
      };
    case ACTIVE_SEQUENCE:
      return {
        ...state,
        activeSequence: action.payload
      }
    default:
      return state;
  }
};

export default uploadReducer;
