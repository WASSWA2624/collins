/**
 * Purchase Request Model
 * File: purchase-request.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizePurchaseRequest = (value) => normalize(value);
const normalizePurchaseRequestList = (value) => normalizeList(value);

export { normalizePurchaseRequest, normalizePurchaseRequestList };
