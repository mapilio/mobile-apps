import { combineReducers } from "redux";
import { imagesReducer, cameraReducer,getTokenReducer } from "./reducers";

export default combineReducers({
  imagesReducer,
  cameraReducer,
  getTokenReducer
});