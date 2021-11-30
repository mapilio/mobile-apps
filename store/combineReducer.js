import { combineReducers } from "redux";
import { imagesReducer, cameraReducer } from "./reducers";

export default combineReducers({
  imagesReducer,
  cameraReducer,
});
