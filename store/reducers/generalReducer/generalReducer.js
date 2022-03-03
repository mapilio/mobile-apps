import {
  UPDATE_CONNECTION_STATUS,
  UPDATE_WELCOME_WALKTHROUGH_STATUS,
  UPDATE_CURRENT_DB,
  MARKETPLACE_DATA,
  UPDATE_CURRENT_FEED_SEQUENCE,
  UPDATE_CAMERA_WALKTHROUGH_STATUS,
  UPDATE_TAB_HEIGHT
} from "../../actionsName";

const INITIAL_STATE = {
  connection: { connectionStatus: true, connectionType: "wifi" },
  welcomeWalkthroughStatus: false,
  cameraWalkthroughStatus: false,
  db: null,
  marketplaceData: {},
  currentFeedSequence: null,
  tabHeight: 0,
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
    case MARKETPLACE_DATA:
      return {
        ...state,
        marketplaceData: action.payload,
      };
    case UPDATE_CURRENT_FEED_SEQUENCE:
      return {
        ...state,
        currentFeedSequence: action.payload,
      };
    case UPDATE_TAB_HEIGHT:
      return {
        ...state,
        tabHeight: action.payload,
      };
    default:
      return state;
  }
};

export default generalReducer;
