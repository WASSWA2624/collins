/**
 * Formulary Item API
 * File: formulary-item.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const formularyItemApi = createCrudApi(endpoints.FORMULARY_ITEMS);

export { formularyItemApi };
