/**
 * Stock Movement Rules
 * File: stock-movement.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseStockMovementId = (value) => parseId(value);
const parseStockMovementPayload = (value) => parsePayload(value);
const parseStockMovementListParams = (value) => parseListParams(value);

export { parseStockMovementId, parseStockMovementPayload, parseStockMovementListParams };
