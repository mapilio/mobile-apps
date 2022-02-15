import {
  ACTIVE_SEQUENCE,
  PROGRESS,
  SEQUENCE_IMAGES,
  SWITCH_SELECTOR,
  UPLOAD_DATA
} from "../../actionsName";

const INITIAL_STATE = {
  progress: 0,
  uploadData: [],
  activeSequence: '',
  sequenceImages: [],
  switchSelector: 'image',
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
    case SEQUENCE_IMAGES:
      return {
        ...state,
        sequenceImages: action.payload
      }
    case SWITCH_SELECTOR:
      return {
        ...state,
        switchSelector: action.payload
      }
    default:
      return state;
  }
};

export default uploadReducer;
