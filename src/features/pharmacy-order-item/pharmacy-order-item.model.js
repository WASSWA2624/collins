/**
 * Pharmacy Order Item Model
 * File: pharmacy-order-item.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizePharmacyOrderItem = (value) => normalize(value);
const normalizePharmacyOrderItemList = (value) => normalizeList(value);

export { normalizePharmacyOrderItem, normalizePharmacyOrderItemList };
