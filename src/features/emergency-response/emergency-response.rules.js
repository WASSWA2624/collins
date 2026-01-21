/**
 * Emergency Response Rules
 * File: emergency-response.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseEmergencyResponseId = (value) => parseId(value);
const parseEmergencyResponsePayload = (value) => parsePayload(value);
const parseEmergencyResponseListParams = (value) => parseListParams(value);

export {
  parseEmergencyResponseId,
  parseEmergencyResponsePayload,
  parseEmergencyResponseListParams,
};
