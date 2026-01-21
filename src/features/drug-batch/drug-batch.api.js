/**
 * Drug Batch API
 * File: drug-batch.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const drugBatchApi = createCrudApi(endpoints.DRUG_BATCHES);

export { drugBatchApi };
