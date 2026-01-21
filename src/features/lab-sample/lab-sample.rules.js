/**
 * Lab Sample Rules
 * File: lab-sample.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseLabSampleId = (value) => parseId(value);
const parseLabSamplePayload = (value) => parsePayload(value);
const parseLabSampleListParams = (value) => parseListParams(value);

export { parseLabSampleId, parseLabSamplePayload, parseLabSampleListParams };
