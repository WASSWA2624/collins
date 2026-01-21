/**
 * Dispense Log Rules
 * File: dispense-log.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseDispenseLogId = (value) => parseId(value);
const parseDispenseLogPayload = (value) => parsePayload(value);
const parseDispenseLogListParams = (value) => parseListParams(value);

export { parseDispenseLogId, parseDispenseLogPayload, parseDispenseLogListParams };
