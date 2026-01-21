/**
 * Purchase Order Model
 * File: purchase-order.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizePurchaseOrder = (value) => normalize(value);
const normalizePurchaseOrderList = (value) => normalizeList(value);

export { normalizePurchaseOrder, normalizePurchaseOrderList };
