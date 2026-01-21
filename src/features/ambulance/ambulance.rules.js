/**
 * Ambulance Rules
 * File: ambulance.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseAmbulanceId = (value) => parseId(value);
const parseAmbulancePayload = (value) => parsePayload(value);
const parseAmbulanceListParams = (value) => parseListParams(value);

export { parseAmbulanceId, parseAmbulancePayload, parseAmbulanceListParams };
