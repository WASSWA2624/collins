/**
 * Adverse Event API
 * File: adverse-event.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const adverseEventApi = createCrudApi(endpoints.ADVERSE_EVENTS);

export { adverseEventApi };
