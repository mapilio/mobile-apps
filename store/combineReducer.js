import { combineReducers } from "redux";
import {
  imagesReducer,
  cameraReducer,
  getTokenReducer,
  generalReducer,
  settingsReducer,
  uploadReducer,
  marketplaceReducer,
  leaderboardReducer,
  tooltipReducer,
} from "./reducers";

export default combineReducers({
  imagesReducer,
  cameraReducer,
  getTokenReducer,
  generalReducer,
  settingsReducer,
  uploadReducer,
  marketplaceReducer,
  leaderboardReducer,
  tooltipReducer,
});
