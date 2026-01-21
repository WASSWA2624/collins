/**
 * Pharmacy Order Model
 * File: pharmacy-order.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizePharmacyOrder = (value) => normalize(value);
const normalizePharmacyOrderList = (value) => normalizeList(value);

export { normalizePharmacyOrder, normalizePharmacyOrderList };
