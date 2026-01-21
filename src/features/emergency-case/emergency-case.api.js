/**
 * Emergency Case API
 * File: emergency-case.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const emergencyCaseApi = createCrudApi(endpoints.EMERGENCY_CASES);

export { emergencyCaseApi };
