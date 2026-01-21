/**
 * Lab Result Model
 * File: lab-result.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeLabResult = (value) => normalize(value);
const normalizeLabResultList = (value) => normalizeList(value);

export { normalizeLabResult, normalizeLabResultList };
