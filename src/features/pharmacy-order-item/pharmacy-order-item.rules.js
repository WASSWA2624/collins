/**
 * Pharmacy Order Item Rules
 * File: pharmacy-order-item.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parsePharmacyOrderItemId = (value) => parseId(value);
const parsePharmacyOrderItemPayload = (value) => parsePayload(value);
const parsePharmacyOrderItemListParams = (value) => parseListParams(value);

export { parsePharmacyOrderItemId, parsePharmacyOrderItemPayload, parsePharmacyOrderItemListParams };
