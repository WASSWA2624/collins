/**
 * Inventory Stock Model
 * File: inventory-stock.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeInventoryStock = (value) => normalize(value);
const normalizeInventoryStockList = (value) => normalizeList(value);

export { normalizeInventoryStock, normalizeInventoryStockList };
