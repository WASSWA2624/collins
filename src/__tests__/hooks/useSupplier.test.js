/**
 * useSupplier Hook Tests
 * File: useSupplier.test.js
 */
import useSupplier from '@hooks/useSupplier';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useSupplier', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useSupplier);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
