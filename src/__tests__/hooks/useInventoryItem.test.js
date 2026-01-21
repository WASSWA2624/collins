/**
 * useInventoryItem Hook Tests
 * File: useInventoryItem.test.js
 */
import useInventoryItem from '@hooks/useInventoryItem';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useInventoryItem', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useInventoryItem);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
