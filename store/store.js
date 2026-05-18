import { applyMiddleware, createStore } from 'redux';
import reducer from './combineReducer';
import { thunk } from 'redux-thunk';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import { createTransform, persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JSOG from 'jsog';

export const JSOGTransform = createTransform(
  (inboundState, key) => JSOG.encode(inboundState),
  (outboundState, key) => JSOG.decode(outboundState)
);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  blacklist: ['cameraReducer', 'imagesReducer', 'marketplaceReducer'],
  transform: [JSOGTransform],
};

const persistedReducer = persistReducer(persistConfig, reducer);
export const store = createStore(persistedReducer, applyMiddleware(thunk));

export const persistor = persistStore(store);
