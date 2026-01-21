/**
 * Purchase Order Rules
 * File: purchase-order.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parsePurchaseOrderId = (value) => parseId(value);
const parsePurchaseOrderPayload = (value) => parsePayload(value);
const parsePurchaseOrderListParams = (value) => parseListParams(value);

export { parsePurchaseOrderId, parsePurchaseOrderPayload, parsePurchaseOrderListParams };
