/**
 * Lab Order Item Model
 * File: lab-order-item.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeLabOrderItem = (value) => normalize(value);
const normalizeLabOrderItemList = (value) => normalizeList(value);

export { normalizeLabOrderItem, normalizeLabOrderItemList };
