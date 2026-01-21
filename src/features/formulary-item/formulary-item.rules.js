/**
 * Formulary Item Rules
 * File: formulary-item.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseFormularyItemId = (value) => parseId(value);
const parseFormularyItemPayload = (value) => parsePayload(value);
const parseFormularyItemListParams = (value) => parseListParams(value);

export { parseFormularyItemId, parseFormularyItemPayload, parseFormularyItemListParams };
