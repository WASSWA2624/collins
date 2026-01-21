/**
 * Emergency Response Model Tests
 * File: emergency-response.model.test.js
 */
import {
  normalizeEmergencyResponse,
  normalizeEmergencyResponseList,
} from '@features/emergency-response';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('emergency-response.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeEmergencyResponse, normalizeEmergencyResponseList);
  });
});
