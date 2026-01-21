/**
 * ICU Observation Model
 * File: icu-observation.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeIcuObservation = (value) => normalize(value);
const normalizeIcuObservationList = (value) => normalizeList(value);

export { normalizeIcuObservation, normalizeIcuObservationList };
