/**
 * Purchase Request Rules
 * File: purchase-request.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parsePurchaseRequestId = (value) => parseId(value);
const parsePurchaseRequestPayload = (value) => parsePayload(value);
const parsePurchaseRequestListParams = (value) => parseListParams(value);

export { parsePurchaseRequestId, parsePurchaseRequestPayload, parsePurchaseRequestListParams };
