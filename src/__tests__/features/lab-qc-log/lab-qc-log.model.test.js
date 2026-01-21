/**
 * Lab QC Log Model Tests
 * File: lab-qc-log.model.test.js
 */
import { normalizeLabQcLog, normalizeLabQcLogList } from '@features/lab-qc-log';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('lab-qc-log.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeLabQcLog, normalizeLabQcLogList);
  });
});
