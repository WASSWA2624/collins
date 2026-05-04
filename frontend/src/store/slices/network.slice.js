/**
 * Network Slice
 * Tracks network connectivity state
 * File: network.slice.js
 */
import { createSlice } from '@reduxjs/toolkit';
import { NETWORK_QUALITY } from '@utils/networkQuality';

const initialState = {
  isOnline: true,
  isSyncing: false,
  quality: NETWORK_QUALITY.UNKNOWN,
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setOnline: (state, action) => {
      state.isOnline = action.payload;
    },
    setSyncing: (state, action) => {
      state.isSyncing = action.payload;
    },
    setQuality: (state, action) => {
      state.quality = action.payload;
    },
  },
});

const actions = networkSlice.actions;
const reducer = networkSlice.reducer;

export { actions, reducer };
export default { actions, reducer };

