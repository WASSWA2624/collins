/**
 * ICU Stay Model Tests
 * File: icu-stay.model.test.js
 */
import { normalizeIcuStay, normalizeIcuStayList } from '@features/icu-stay';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('icu-stay.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeIcuStay, normalizeIcuStayList);
  });
});
