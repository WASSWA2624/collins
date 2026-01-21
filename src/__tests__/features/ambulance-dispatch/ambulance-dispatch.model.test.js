/**
 * Ambulance Dispatch Model Tests
 * File: ambulance-dispatch.model.test.js
 */
import {
  normalizeAmbulanceDispatch,
  normalizeAmbulanceDispatchList,
} from '@features/ambulance-dispatch';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('ambulance-dispatch.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeAmbulanceDispatch, normalizeAmbulanceDispatchList);
  });
});
