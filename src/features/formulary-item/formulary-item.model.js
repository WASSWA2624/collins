/**
 * Formulary Item Model
 * File: formulary-item.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeFormularyItem = (value) => normalize(value);
const normalizeFormularyItemList = (value) => normalizeList(value);

export { normalizeFormularyItem, normalizeFormularyItemList };
