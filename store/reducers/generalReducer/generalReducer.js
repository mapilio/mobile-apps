import {
  UPDATE_CONNECTION_STATUS,
  UPDATE_WELCOME_WALKTHROUGH_STATUS,
  UPDATE_CURRENT_DB,
  UPDATE_CURRENT_FEED_SEQUENCE,
  UPDATE_CAMERA_WALKTHROUGH_STATUS,
  UPDATE_LANGUAGE,
  MAP_WATCH_ID
} from "../../actionsName";

const INITIAL_STATE = {
  connection: { connectionStatus: true, connectionType: "wifi" },
  welcomeWalkthroughStatus: false,
  cameraWalkthroughStatus: false,
  db: null,
  currentFeedSequence: null,
  language: 'en',
  mapWatchId: null
};

const generalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_CONNECTION_STATUS:
      return {
        ...state,
        connection: action.payload,
      };
    case UPDATE_WELCOME_WALKTHROUGH_STATUS:
      return {
        ...state,
        welcomeWalkthroughStatus: action.payload,
      };
    case UPDATE_CAMERA_WALKTHROUGH_STATUS:
      return {
        ...state,
        cameraWalkthroughStatus: action.payload,
      };
    case UPDATE_CURRENT_DB:
      return {
        ...state,
        db: action.payload,
      };
    case UPDATE_CURRENT_FEED_SEQUENCE:
      return {
        ...state,
        currentFeedSequence: action.payload,
      };
    case UPDATE_LANGUAGE:
      return {
        ...state,
        language: action.payload
      }
    case MAP_WATCH_ID:
      return {
        ...state,
        mapWatchId: action.payload
      }
    default:
      return state;
  }
};

export default generalReducer;
