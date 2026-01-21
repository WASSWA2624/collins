/**
 * Dispense Log Model
 * File: dispense-log.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeDispenseLog = (value) => normalize(value);
const normalizeDispenseLogList = (value) => normalizeList(value);

export { normalizeDispenseLog, normalizeDispenseLogList };
