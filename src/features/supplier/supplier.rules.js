/**
 * Supplier Rules
 * File: supplier.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseSupplierId = (value) => parseId(value);
const parseSupplierPayload = (value) => parsePayload(value);
const parseSupplierListParams = (value) => parseListParams(value);

export { parseSupplierId, parseSupplierPayload, parseSupplierListParams };
