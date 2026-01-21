/**
 * Lab Order Rules
 * File: lab-order.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseLabOrderId = (value) => parseId(value);
const parseLabOrderPayload = (value) => parsePayload(value);
const parseLabOrderListParams = (value) => parseListParams(value);

export { parseLabOrderId, parseLabOrderPayload, parseLabOrderListParams };
