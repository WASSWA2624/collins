/**
 * Formulary Item Model Tests
 * File: formulary-item.model.test.js
 */
import { normalizeFormularyItem, normalizeFormularyItemList } from '@features/formulary-item';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('formulary-item.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeFormularyItem, normalizeFormularyItemList);
  });
});
