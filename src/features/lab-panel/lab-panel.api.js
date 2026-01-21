/**
 * Lab Panel API
 * File: lab-panel.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const labPanelApi = createCrudApi(endpoints.LAB_PANELS);

export { labPanelApi };
