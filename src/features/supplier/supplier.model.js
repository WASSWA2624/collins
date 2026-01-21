/**
 * Supplier Model
 * File: supplier.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeSupplier = (value) => normalize(value);
const normalizeSupplierList = (value) => normalizeList(value);

export { normalizeSupplier, normalizeSupplierList };
