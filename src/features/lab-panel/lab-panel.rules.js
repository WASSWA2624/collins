/**
 * Lab Panel Rules
 * File: lab-panel.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseLabPanelId = (value) => parseId(value);
const parseLabPanelPayload = (value) => parsePayload(value);
const parseLabPanelListParams = (value) => parseListParams(value);

export { parseLabPanelId, parseLabPanelPayload, parseLabPanelListParams };
