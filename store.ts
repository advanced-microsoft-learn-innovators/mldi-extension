import { configureStore } from '@reduxjs/toolkit';
import { localStorage } from 'redux-persist-webextension-storage';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  RESYNC,
  persistReducer,
  persistStore
} from '@plasmohq/redux-persist';
import { Storage } from '@plasmohq/storage';

import counterReducer from '~word-state';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: localStorage
};

const persistedReducer = persistReducer(persistConfig, counterReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          RESYNC
        ]
      }
    })
});

export const persistor = persistStore(store);

new Storage().watch({
  [`persist:${persistConfig.key}`]: () => {
    persistor.resync();
  }
});
