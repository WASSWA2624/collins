/**
 * Ambulance Model Tests
 * File: ambulance.model.test.js
 */
import { normalizeAmbulance, normalizeAmbulanceList } from '@features/ambulance';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('ambulance.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeAmbulance, normalizeAmbulanceList);
  });
});
