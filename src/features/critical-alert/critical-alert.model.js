/**
 * Critical Alert Model
 * File: critical-alert.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeCriticalAlert = (value) => normalize(value);
const normalizeCriticalAlertList = (value) => normalizeList(value);

export { normalizeCriticalAlert, normalizeCriticalAlertList };
