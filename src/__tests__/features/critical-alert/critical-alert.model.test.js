/**
 * Critical Alert Model Tests
 * File: critical-alert.model.test.js
 */
import { normalizeCriticalAlert, normalizeCriticalAlertList } from '@features/critical-alert';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('critical-alert.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeCriticalAlert, normalizeCriticalAlertList);
  });
});
