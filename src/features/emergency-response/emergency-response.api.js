/**
 * Emergency Response API
 * File: emergency-response.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const emergencyResponseApi = createCrudApi(endpoints.EMERGENCY_RESPONSES);

export { emergencyResponseApi };
