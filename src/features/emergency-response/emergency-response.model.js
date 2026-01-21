/**
 * Emergency Response Model
 * File: emergency-response.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeEmergencyResponse = (value) => normalize(value);
const normalizeEmergencyResponseList = (value) => normalizeList(value);

export { normalizeEmergencyResponse, normalizeEmergencyResponseList };
