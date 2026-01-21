/**
 * Lab Result Rules
 * File: lab-result.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseLabResultId = (value) => parseId(value);
const parseLabResultPayload = (value) => parsePayload(value);
const parseLabResultListParams = (value) => parseListParams(value);

export { parseLabResultId, parseLabResultPayload, parseLabResultListParams };
