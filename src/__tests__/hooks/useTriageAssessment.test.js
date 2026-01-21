/**
 * useTriageAssessment Hook Tests
 * File: useTriageAssessment.test.js
 */
import useTriageAssessment from '@hooks/useTriageAssessment';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useTriageAssessment', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useTriageAssessment);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
