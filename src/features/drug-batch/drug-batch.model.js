/**
 * Drug Batch Model
 * File: drug-batch.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeDrugBatch = (value) => normalize(value);
const normalizeDrugBatchList = (value) => normalizeList(value);

export { normalizeDrugBatch, normalizeDrugBatchList };
