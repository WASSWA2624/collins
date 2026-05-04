/**
 * Store Creation
 * File: index.js
 */
import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import rootReducer from './rootReducer';
import middleware from './middleware';
import { createPersistedReducer } from './persist';

const store = configureStore({
  reducer: createPersistedReducer(rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(middleware),
  devTools: process.env.NODE_ENV === 'development',
});

const persistor = persistStore(store);

// Export store with persistor attached
store.persistor = persistor;

export default store;

