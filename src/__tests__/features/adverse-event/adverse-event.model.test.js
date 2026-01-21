/**
 * Adverse Event Model Tests
 * File: adverse-event.model.test.js
 */
import { normalizeAdverseEvent, normalizeAdverseEventList } from '@features/adverse-event';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('adverse-event.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeAdverseEvent, normalizeAdverseEventList);
  });
});
