import {
  UPDATE_CONNECTION_STATUS,
  UPDATE_WELCOME_WALKTHROUGH_STATUS,
  UPDATE_CURRENT_DB,
  UPDATE_CURRENT_FEED_SEQUENCE,
  UPDATE_LANGUAGE,
  SET_CURRENT_POSITION,
  SET_DEBUG_MODE,
  SET_MAP_MODE,
  SET_MAINTENANCE_MODE,
  SET_CONFIG,
} from "../../actionsName";

const INITIAL_STATE = {
  connection: { connectionStatus: true, connectionType: "wifi" },
  welcomeWalkthroughStatus: false,
  db: null,
  currentFeedSequence: null,
  language: 'en',
  currentPosition: undefined,
  debugMode: false,
  mapShown: true,
  maintenanceMode: false,
  config:{
    isMarketOpen: false,
    isChallengeOpen: false,
    challengeDescTR: '',
    challengeDescEN: '',
    challengeURL: '',
    challengeDates: [],
    isInfoBoxOpen: false,
    infoBoxDescTR: '',
    infoBoxDescEN: '',
    showWeek: true,
    socialLogin: {
      isFacebookEnabled: false,
      isGoogleEnabled: false,
      isAppleEnabled: false,
      isOSMEnabled: false
    },
    versions:{
      ios:{
        version: 0,
        minVersion: 0
      },
      android:{
        version: 0,
        minVersion: 0
      }
    },
    mapTokens:{
      androidToken: "",
      iosToken: ""
    },
    osmModal:{
      titleTR: "",
      titleEN: "",
      descriptionTR: "",
      descriptionEN: ""
    },
  }
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
    case SET_DEBUG_MODE:
      return {
        ...state,
        debugMode: action.payload,
      }
    case SET_MAP_MODE:
      return {
        ...state,
        mapShown: action.payload,
      }
    case SET_MAINTENANCE_MODE:
      return {
        ...state,
        maintenanceMode: action.payload,
      }
    case SET_CONFIG:
      return {
        ...state,
        config: {
          ...state.config,
          ...action.payload
        }
      }
    default:
      return state;
  }
};

export default generalReducer;
