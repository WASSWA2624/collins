/**
 * useEmergencyCase Hook Tests
 * File: useEmergencyCase.test.js
 */
import useEmergencyCase from '@hooks/useEmergencyCase';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useEmergencyCase', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useEmergencyCase);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
