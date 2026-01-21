/**
 * Emergency Case Model Tests
 * File: emergency-case.model.test.js
 */
import { normalizeEmergencyCase, normalizeEmergencyCaseList } from '@features/emergency-case';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('emergency-case.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeEmergencyCase, normalizeEmergencyCaseList);
  });
});
