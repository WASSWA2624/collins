/**
 * useStockMovement Hook Tests
 * File: useStockMovement.test.js
 */
import useStockMovement from '@hooks/useStockMovement';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useStockMovement', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useStockMovement);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
