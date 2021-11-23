import { combineReducers } from "redux";
import {getTokenReducer, imagesReducer} from "./reducers";

export default combineReducers({
  imagesReducer,
  getTokenReducer,
});