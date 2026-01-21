/**
 * ICU Observation Model Tests
 * File: icu-observation.model.test.js
 */
import { normalizeIcuObservation, normalizeIcuObservationList } from '@features/icu-observation';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('icu-observation.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeIcuObservation, normalizeIcuObservationList);
  });
});
