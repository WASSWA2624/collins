/**
 * usePurchaseRequest Hook Tests
 * File: usePurchaseRequest.test.js
 */
import usePurchaseRequest from '@hooks/usePurchaseRequest';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('usePurchaseRequest', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(usePurchaseRequest);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
