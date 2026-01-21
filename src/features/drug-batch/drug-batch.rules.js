/**
 * Drug Batch Rules
 * File: drug-batch.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseDrugBatchId = (value) => parseId(value);
const parseDrugBatchPayload = (value) => parsePayload(value);
const parseDrugBatchListParams = (value) => parseListParams(value);

export { parseDrugBatchId, parseDrugBatchPayload, parseDrugBatchListParams };
