/**
 * Drug Rules
 * File: drug.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseDrugId = (value) => parseId(value);
const parseDrugPayload = (value) => parsePayload(value);
const parseDrugListParams = (value) => parseListParams(value);

export { parseDrugId, parseDrugPayload, parseDrugListParams };
