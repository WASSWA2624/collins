/**
 * Ambulance Model
 * File: ambulance.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeAmbulance = (value) => normalize(value);
const normalizeAmbulanceList = (value) => normalizeList(value);

export { normalizeAmbulance, normalizeAmbulanceList };
