/**
 * Ambulance Trip Model Tests
 * File: ambulance-trip.model.test.js
 */
import { normalizeAmbulanceTrip, normalizeAmbulanceTripList } from '@features/ambulance-trip';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('ambulance-trip.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeAmbulanceTrip, normalizeAmbulanceTripList);
  });
});
