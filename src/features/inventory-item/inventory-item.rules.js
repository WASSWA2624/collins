/**
 * Inventory Item Rules
 * File: inventory-item.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseInventoryItemId = (value) => parseId(value);
const parseInventoryItemPayload = (value) => parsePayload(value);
const parseInventoryItemListParams = (value) => parseListParams(value);

export { parseInventoryItemId, parseInventoryItemPayload, parseInventoryItemListParams };
