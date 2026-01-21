/**
 * Stock Adjustment Rules
 * File: stock-adjustment.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseStockAdjustmentId = (value) => parseId(value);
const parseStockAdjustmentPayload = (value) => parsePayload(value);
const parseStockAdjustmentListParams = (value) => parseListParams(value);

export { parseStockAdjustmentId, parseStockAdjustmentPayload, parseStockAdjustmentListParams };
