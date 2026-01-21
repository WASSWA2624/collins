/**
 * Critical Alert Rules
 * File: critical-alert.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseCriticalAlertId = (value) => parseId(value);
const parseCriticalAlertPayload = (value) => parsePayload(value);
const parseCriticalAlertListParams = (value) => parseListParams(value);

export { parseCriticalAlertId, parseCriticalAlertPayload, parseCriticalAlertListParams };
