/**
 * useAmbulance Hook Tests
 * File: useAmbulance.test.js
 */
import useAmbulance from '@hooks/useAmbulance';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useAmbulance', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useAmbulance);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
