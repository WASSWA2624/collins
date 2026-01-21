/**
 * Dispense Log Model Tests
 * File: dispense-log.model.test.js
 */
import { normalizeDispenseLog, normalizeDispenseLogList } from '@features/dispense-log';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('dispense-log.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeDispenseLog, normalizeDispenseLogList);
  });
});
