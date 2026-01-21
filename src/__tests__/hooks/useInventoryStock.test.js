/**
 * useInventoryStock Hook Tests
 * File: useInventoryStock.test.js
 */
import useInventoryStock from '@hooks/useInventoryStock';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useInventoryStock', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useInventoryStock);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
