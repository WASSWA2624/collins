/**
 * ICU Observation Rules
 * File: icu-observation.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseIcuObservationId = (value) => parseId(value);
const parseIcuObservationPayload = (value) => parsePayload(value);
const parseIcuObservationListParams = (value) => parseListParams(value);

export { parseIcuObservationId, parseIcuObservationPayload, parseIcuObservationListParams };
