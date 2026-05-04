/**
 * Redux Persist Configuration
 * File: persist.js
 */
import { persistReducer } from 'redux-persist';
import { async as asyncStorage } from '@services/storage';

const persistConfig = {
  key: 'root',
  storage: {
    getItem: asyncStorage.getItem,
    setItem: asyncStorage.setItem,
    removeItem: asyncStorage.removeItem,
  },
  whitelist: ['ui'], // Only persist UI state
};

const createPersistedReducer = (reducer) => {
  return persistReducer(persistConfig, reducer);
};

export { createPersistedReducer };
export default { createPersistedReducer };

