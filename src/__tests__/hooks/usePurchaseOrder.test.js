/**
 * usePurchaseOrder Hook Tests
 * File: usePurchaseOrder.test.js
 */
import usePurchaseOrder from '@hooks/usePurchaseOrder';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('usePurchaseOrder', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(usePurchaseOrder);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
