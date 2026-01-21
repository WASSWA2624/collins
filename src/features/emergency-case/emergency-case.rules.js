/**
 * Emergency Case Rules
 * File: emergency-case.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseEmergencyCaseId = (value) => parseId(value);
const parseEmergencyCasePayload = (value) => parsePayload(value);
const parseEmergencyCaseListParams = (value) => parseListParams(value);

export { parseEmergencyCaseId, parseEmergencyCasePayload, parseEmergencyCaseListParams };
