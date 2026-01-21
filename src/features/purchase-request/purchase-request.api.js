/**
 * Purchase Request API
 * File: purchase-request.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const purchaseRequestApi = createCrudApi(endpoints.PURCHASE_REQUESTS);

export { purchaseRequestApi };
