/**
 * Critical Alert API
 * File: critical-alert.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const criticalAlertApi = createCrudApi(endpoints.CRITICAL_ALERTS);

export { criticalAlertApi };
