/**
 * Adverse Event Model
 * File: adverse-event.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeAdverseEvent = (value) => normalize(value);
const normalizeAdverseEventList = (value) => normalizeList(value);

export { normalizeAdverseEvent, normalizeAdverseEventList };
