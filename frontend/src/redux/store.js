// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default storage engine (localStorage)
import authReducer from './authSlice';

// Redux-persist configuration for the auth slice
const persistConfig = {
  key: 'auth', // The key to use in storage
  storage,     // Specify the storage engine
};

// Create a persisted reducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Configure the store with the persisted reducer
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

// Create a persistor
export const persistor = persistStore(store);

export default store;
