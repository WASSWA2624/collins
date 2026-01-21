/**
 * Lab Sample Model
 * File: lab-sample.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeLabSample = (value) => normalize(value);
const normalizeLabSampleList = (value) => normalizeList(value);

export { normalizeLabSample, normalizeLabSampleList };
