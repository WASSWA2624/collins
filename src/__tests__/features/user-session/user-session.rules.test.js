/**
 * User Session Rules Tests
 * File: user-session.rules.test.js
 */
import {
  parseUserSessionId,
  parseUserSessionListParams,
} from '@features/user-session/user-session.rules';
import { expectIdParser, expectListParamsParser } from '../../helpers/crud-assertions';

describe('user-session.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseUserSessionId);
  });

  it('parses list params', () => {
    expectListParamsParser(parseUserSessionListParams);
  });
});
