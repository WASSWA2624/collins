/**
 * useAmbulanceDispatch Hook Tests
 * File: useAmbulanceDispatch.test.js
 */
import useAmbulanceDispatch from '@hooks/useAmbulanceDispatch';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useAmbulanceDispatch', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useAmbulanceDispatch);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
