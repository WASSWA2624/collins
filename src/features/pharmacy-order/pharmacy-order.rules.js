/**
 * Pharmacy Order Rules
 * File: pharmacy-order.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parsePharmacyOrderId = (value) => parseId(value);
const parsePharmacyOrderPayload = (value) => parsePayload(value);
const parsePharmacyOrderListParams = (value) => parseListParams(value);

export { parsePharmacyOrderId, parsePharmacyOrderPayload, parsePharmacyOrderListParams };
