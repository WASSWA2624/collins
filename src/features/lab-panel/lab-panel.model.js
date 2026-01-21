/**
 * Lab Panel Model
 * File: lab-panel.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeLabPanel = (value) => normalize(value);
const normalizeLabPanelList = (value) => normalizeList(value);

export { normalizeLabPanel, normalizeLabPanelList };
