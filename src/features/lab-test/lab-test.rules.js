/**
 * Lab Test Rules
 * File: lab-test.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseLabTestId = (value) => parseId(value);
const parseLabTestPayload = (value) => parsePayload(value);
const parseLabTestListParams = (value) => parseListParams(value);

export { parseLabTestId, parseLabTestPayload, parseLabTestListParams };
