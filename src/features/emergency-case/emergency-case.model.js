/**
 * Emergency Case Model
 * File: emergency-case.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeEmergencyCase = (value) => normalize(value);
const normalizeEmergencyCaseList = (value) => normalizeList(value);

export { normalizeEmergencyCase, normalizeEmergencyCaseList };
