/**
 * Lab Order Model
 * File: lab-order.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeLabOrder = (value) => normalize(value);
const normalizeLabOrderList = (value) => normalizeList(value);

export { normalizeLabOrder, normalizeLabOrderList };
