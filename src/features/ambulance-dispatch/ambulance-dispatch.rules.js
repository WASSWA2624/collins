/**
 * Ambulance Dispatch Rules
 * File: ambulance-dispatch.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseAmbulanceDispatchId = (value) => parseId(value);
const parseAmbulanceDispatchPayload = (value) => parsePayload(value);
const parseAmbulanceDispatchListParams = (value) => parseListParams(value);

export {
  parseAmbulanceDispatchId,
  parseAmbulanceDispatchPayload,
  parseAmbulanceDispatchListParams,
};
