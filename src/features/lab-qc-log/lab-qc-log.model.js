/**
 * Lab QC Log Model
 * File: lab-qc-log.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeLabQcLog = (value) => normalize(value);
const normalizeLabQcLogList = (value) => normalizeList(value);

export { normalizeLabQcLog, normalizeLabQcLogList };
