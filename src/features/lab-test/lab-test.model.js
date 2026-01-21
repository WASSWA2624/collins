/**
 * Lab Test Model
 * File: lab-test.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeLabTest = (value) => normalize(value);
const normalizeLabTestList = (value) => normalizeList(value);

export { normalizeLabTest, normalizeLabTestList };
