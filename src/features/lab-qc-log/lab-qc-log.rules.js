/**
 * Lab QC Log Rules
 * File: lab-qc-log.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseLabQcLogId = (value) => parseId(value);
const parseLabQcLogPayload = (value) => parsePayload(value);
const parseLabQcLogListParams = (value) => parseListParams(value);

export { parseLabQcLogId, parseLabQcLogPayload, parseLabQcLogListParams };
