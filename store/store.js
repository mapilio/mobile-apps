import { createStore } from "redux";
import reducer from "./combineReducer";

export const store = createStore(reducer);
