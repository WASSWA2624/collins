/**
 * Inventory Stock Rules
 * File: inventory-stock.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseInventoryStockId = (value) => parseId(value);
const parseInventoryStockPayload = (value) => parsePayload(value);
const parseInventoryStockListParams = (value) => parseListParams(value);

export { parseInventoryStockId, parseInventoryStockPayload, parseInventoryStockListParams };
