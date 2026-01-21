/**
 * ICU Stay Rules
 * File: icu-stay.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseIcuStayId = (value) => parseId(value);
const parseIcuStayPayload = (value) => parsePayload(value);
const parseIcuStayListParams = (value) => parseListParams(value);

export { parseIcuStayId, parseIcuStayPayload, parseIcuStayListParams };
