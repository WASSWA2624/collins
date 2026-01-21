/**
 * Drug Model
 * File: drug.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeDrug = (value) => normalize(value);
const normalizeDrugList = (value) => normalizeList(value);

export { normalizeDrug, normalizeDrugList };
