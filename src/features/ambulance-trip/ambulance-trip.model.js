/**
 * Ambulance Trip Model
 * File: ambulance-trip.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeAmbulanceTrip = (value) => normalize(value);
const normalizeAmbulanceTripList = (value) => normalizeList(value);

export { normalizeAmbulanceTrip, normalizeAmbulanceTripList };
