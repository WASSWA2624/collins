/**
 * Store Persist Tests
 * File: persist.test.js
 */
import { createPersistedReducer } from '@store/persist';
import { persistReducer } from 'redux-persist';
import { async as asyncStorage } from '@services/storage';

jest.mock('redux-persist', () => ({
  persistReducer: jest.fn(),
}));

jest.mock('@services/storage', () => ({
  async: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

describe('store/persist', () => {
  it('wraps reducer with persist config', () => {
    const reducer = jest.fn();
    const persisted = jest.fn();
    persistReducer.mockReturnValue(persisted);

    const result = createPersistedReducer(reducer);

    expect(persistReducer).toHaveBeenCalledWith(
      {
        key: 'root',
        storage: {
          getItem: asyncStorage.getItem,
          setItem: asyncStorage.setItem,
          removeItem: asyncStorage.removeItem,
        },
        whitelist: ['ui'],
      },
      reducer
    );
    expect(result).toBe(persisted);
  });
});
