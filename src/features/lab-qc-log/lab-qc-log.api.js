/**
 * Lab QC Log API
 * File: lab-qc-log.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const labQcLogApi = createCrudApi(endpoints.LAB_QC_LOGS);

export { labQcLogApi };
