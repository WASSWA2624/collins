/**
 * Dispense Log API
 * File: dispense-log.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const dispenseLogApi = createCrudApi(endpoints.DISPENSE_LOGS);

export { dispenseLogApi };
