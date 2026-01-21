/**
 * Inventory Item Model
 * File: inventory-item.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeInventoryItem = (value) => normalize(value);
const normalizeInventoryItemList = (value) => normalizeList(value);

export { normalizeInventoryItem, normalizeInventoryItemList };
