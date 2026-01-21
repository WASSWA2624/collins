/**
 * useGoodsReceipt Hook Tests
 * File: useGoodsReceipt.test.js
 */
import useGoodsReceipt from '@hooks/useGoodsReceipt';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useGoodsReceipt', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useGoodsReceipt);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
