import {applyMiddleware, createStore} from "redux";
import reducer from "./combineReducer";
import thunk from "redux-thunk";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import {persistReducer, persistStore} from "redux-persist";
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2
};

const persistedReducer = persistReducer(persistConfig, reducer);
export const store = createStore(persistedReducer, applyMiddleware(thunk));

export const persistor = persistStore(store);
