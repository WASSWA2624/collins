/**
 * Root Reducer
 * Combines all reducers
 * File: rootReducer.js
 * 
 * Phase 6: Only includes core slices (ui, network).
 * Feature slices will be added in Phase 9.
 */
import { combineReducers } from '@reduxjs/toolkit';
import { reducer as uiReducer } from './slices/ui.slice';
import { reducer as networkReducer } from './slices/network.slice';
import { reducer as authReducer } from './slices/auth.slice';
import { reducer as ventilationReducer } from './slices/ventilation.slice';

const rootReducer = combineReducers({
  ui: uiReducer,
  network: networkReducer,
  auth: authReducer,
  ventilation: ventilationReducer,
});

export default rootReducer;
