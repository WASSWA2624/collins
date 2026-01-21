/**
 * Supplier API
 * File: supplier.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const supplierApi = createCrudApi(endpoints.SUPPLIERS);

export { supplierApi };
