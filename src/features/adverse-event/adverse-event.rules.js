/**
 * Adverse Event Rules
 * File: adverse-event.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseAdverseEventId = (value) => parseId(value);
const parseAdverseEventPayload = (value) => parsePayload(value);
const parseAdverseEventListParams = (value) => parseListParams(value);

export { parseAdverseEventId, parseAdverseEventPayload, parseAdverseEventListParams };
