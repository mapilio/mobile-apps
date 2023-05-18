import {
  MARKETPLACE_CENTER,
  ZOOM_LEVEL,
  MARKETPLACE_DATA,
} from "../../actionsName";

const INITIAL_STATE = {
  marketplaceCenter: [9.667969,48.341646],
  zoomLevel: 5,
  marketplaceData: {},
};

const MarketplaceReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MARKETPLACE_CENTER:
      return {
        ...state,
        marketplaceCenter: action.payload,
      };
    case ZOOM_LEVEL:
      return {
        ...state,
        zoomLevel: action.payload,
      };
    case MARKETPLACE_DATA:
      return {
        ...state,
        marketplaceData: action.payload,
      };
    default:
      return state;
  }
};

export default MarketplaceReducer;
