/**
 * Lab Panel Model Tests
 * File: lab-panel.model.test.js
 */
import { normalizeLabPanel, normalizeLabPanelList } from '@features/lab-panel';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('lab-panel.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeLabPanel, normalizeLabPanelList);
  });
});
