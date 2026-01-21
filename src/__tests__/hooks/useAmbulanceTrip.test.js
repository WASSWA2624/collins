/**
 * useAmbulanceTrip Hook Tests
 * File: useAmbulanceTrip.test.js
 */
import useAmbulanceTrip from '@hooks/useAmbulanceTrip';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useAmbulanceTrip', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useAmbulanceTrip);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
