/**
 * Ambulance Dispatch Model
 * File: ambulance-dispatch.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeAmbulanceDispatch = (value) => normalize(value);
const normalizeAmbulanceDispatchList = (value) => normalizeList(value);

export { normalizeAmbulanceDispatch, normalizeAmbulanceDispatchList };
