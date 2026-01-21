/**
 * ICU Stay Model
 * File: icu-stay.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeIcuStay = (value) => normalize(value);
const normalizeIcuStayList = (value) => normalizeList(value);

export { normalizeIcuStay, normalizeIcuStayList };
