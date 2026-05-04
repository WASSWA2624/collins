/**
 * Network Slice Tests
 * File: network.slice.test.js
 */
import { actions, reducer } from '@store/slices/network.slice';
import { NETWORK_QUALITY } from '@utils/networkQuality';

describe('Network Slice', () => {
  const initialState = {
    isOnline: true,
    isSyncing: false,
    quality: NETWORK_QUALITY.UNKNOWN,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialState', () => {
    it('should have correct initial state', () => {
      const state = reducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });
  });

  describe('setOnline', () => {
    it('should set online status to true', () => {
      const state = reducer(initialState, actions.setOnline(true));
      expect(state.isOnline).toBe(true);
    });

    it('should set online status to false', () => {
      const state = reducer(initialState, actions.setOnline(false));
    expect(state.isOnline).toBe(false);
    });

    it('should toggle online status', () => {
      const offlineState = reducer(initialState, actions.setOnline(false));
      const onlineState = reducer(offlineState, actions.setOnline(true));
      expect(onlineState.isOnline).toBe(true);
    });
  });

  describe('setSyncing', () => {
    it('should set syncing status to true', () => {
      const state = reducer(initialState, actions.setSyncing(true));
      expect(state.isSyncing).toBe(true);
    });

    it('should set syncing status to false', () => {
      const syncingState = reducer(initialState, actions.setSyncing(true));
      const notSyncingState = reducer(syncingState, actions.setSyncing(false));
      expect(notSyncingState.isSyncing).toBe(false);
    });
  });

  describe('setQuality', () => {
    it('should set network quality', () => {
      const state = reducer(initialState, actions.setQuality(NETWORK_QUALITY.LOW));
      expect(state.quality).toBe(NETWORK_QUALITY.LOW);
    });
  });

  describe('multiple actions', () => {
    it('should handle multiple state updates', () => {
      let state = reducer(initialState, actions.setOnline(false));
      state = reducer(state, actions.setSyncing(true));

      expect(state.isOnline).toBe(false);
    expect(state.isSyncing).toBe(true);
    });
  });
});

