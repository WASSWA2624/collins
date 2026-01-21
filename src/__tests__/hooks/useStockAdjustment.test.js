/**
 * useStockAdjustment Hook Tests
 * File: useStockAdjustment.test.js
 */
import useStockAdjustment from '@hooks/useStockAdjustment';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useStockAdjustment', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useStockAdjustment);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
