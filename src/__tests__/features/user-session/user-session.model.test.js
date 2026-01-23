/**
 * User Session Model Tests
 * File: user-session.model.test.js
 */
import {
  normalizeUserSession,
  normalizeUserSessionList,
} from '@features/user-session/user-session.model';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('user-session.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeUserSession, normalizeUserSessionList);
  });
});
