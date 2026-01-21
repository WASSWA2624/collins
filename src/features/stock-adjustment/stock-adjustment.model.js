/**
 * Stock Adjustment Model
 * File: stock-adjustment.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeStockAdjustment = (value) => normalize(value);
const normalizeStockAdjustmentList = (value) => normalizeList(value);

export { normalizeStockAdjustment, normalizeStockAdjustmentList };
