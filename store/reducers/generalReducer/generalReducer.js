import {
  UPDATE_CONNECTION_STATUS,
  UPDATE_WELCOME_WALKTHROUGH_STATUS,
  UPDATE_CURRENT_DB,
  UPDATE_CURRENT_FEED_SEQUENCE,
  UPDATE_LANGUAGE,
  SET_CURRENT_POSITION
} from "../../actionsName";

const INITIAL_STATE = {
  connection: { connectionStatus: true, connectionType: "wifi" },
  welcomeWalkthroughStatus: false,
  db: null,
  currentFeedSequence: null,
  language: 'en',
  currentPosition: undefined,
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
    case SET_CURRENT_POSITION:
      return {
        ...state,
        currentPosition: action.payload
      }
    default:
      return state;
  }
};

export default generalReducer;
