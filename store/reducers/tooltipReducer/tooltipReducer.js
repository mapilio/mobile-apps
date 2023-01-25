import {
  SET_TOOLTIP_TABBAR_INITIALIZED,
  SET_TOOLTIP_TABBAR_STEP,
  SET_TOOLTIP_MARKETPLACE_INITIALIZED,
  SET_TOOLTIP_MARKETPLACE_STEP,
  SET_TOOLTIP_CAMERA_INITIALIZED,
  SET_TOOLTIP_CAMERA_STEP,
} from "../../actionsName";

const INITIAL_STATE = {
  tabBar: {
    isInitialized: false,
    step: "map",
  },
  marketplace: {
    isInitialized: false,
    step: "list",
  },
  camera: {
    isInitialized: false,
    step: "tasks",
  },
};

const TooltipReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {
    case SET_TOOLTIP_TABBAR_INITIALIZED:
      return {
        ...state,
        tabBar: {
          ...state.tabBar,
          isInitialized: action.payload,
        },
      };
    case SET_TOOLTIP_TABBAR_STEP:
      return {
        ...state,
        tabBar: {
          ...state.tabBar,
          step: action.payload,
        },
      };
    case SET_TOOLTIP_MARKETPLACE_INITIALIZED:
      return {
        ...state,
        marketplace: {
          ...state.marketplace,
          isInitialized: action.payload,
        },
      };
    case SET_TOOLTIP_MARKETPLACE_STEP:
      return {
        ...state,
        marketplace: {
          ...state.marketplace,
          step: action.payload,
        },
      };
    case SET_TOOLTIP_CAMERA_INITIALIZED:
      return {
        ...state,
        camera: {
          ...state.camera,
          isInitialized: action.payload,
        },
      };
    case SET_TOOLTIP_CAMERA_STEP:
      return {
        ...state,
        camera: {
          ...state.camera,
          step: action.payload,
        },
      };
    default:
      return state;
  }
};

export default TooltipReducer;
