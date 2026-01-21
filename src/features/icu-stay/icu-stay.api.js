/**
 * ICU Stay API
 * File: icu-stay.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const icuStayApi = createCrudApi(endpoints.ICU_STAYS);

export { icuStayApi };
