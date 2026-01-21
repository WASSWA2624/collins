/**
 * Lab Order Item Rules
 * File: lab-order-item.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseLabOrderItemId = (value) => parseId(value);
const parseLabOrderItemPayload = (value) => parsePayload(value);
const parseLabOrderItemListParams = (value) => parseListParams(value);

export { parseLabOrderItemId, parseLabOrderItemPayload, parseLabOrderItemListParams };
