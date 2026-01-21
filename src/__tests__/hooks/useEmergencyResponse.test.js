/**
 * useEmergencyResponse Hook Tests
 * File: useEmergencyResponse.test.js
 */
import useEmergencyResponse from '@hooks/useEmergencyResponse';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useEmergencyResponse', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useEmergencyResponse);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
