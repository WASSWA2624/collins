/**
 * Stock Movement Model
 * File: stock-movement.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeStockMovement = (value) => normalize(value);
const normalizeStockMovementList = (value) => normalizeList(value);

export { normalizeStockMovement, normalizeStockMovementList };
