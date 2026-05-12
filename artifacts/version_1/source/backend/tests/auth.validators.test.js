import test from 'node:test';
import assert from 'node:assert/strict';
import { loginSchema, refreshSchema, registerSchema } from '../src/modules/auth/auth.validators.js';

test('register schema accepts account identity and facility fields', () => {
  const result = registerSchema.parse({
    body: {
      name: ' Clinician One ',
      email: ' Clinician@Example.COM ',
      password: 'secure-pass',
      facilityId: ' facility-1 ',
      requestedRole: 'CLINICIAN',
    },
  });

  assert.equal(result.body.name, 'Clinician One');
  assert.equal(result.body.email, 'clinician@example.com');
  assert.equal(result.body.facilityId, 'facility-1');
  assert.equal(result.body.requestedRole, 'CLINICIAN');
});

test('register schema requires a facility selection', () => {
  assert.throws(() =>
    registerSchema.parse({
      body: {
        name: 'Clinician One',
        email: 'clinician@example.com',
        password: 'secure-pass',
      },
    })
  );
});

test('register schema rejects non-clinician requested roles', () => {
  assert.throws(() =>
    registerSchema.parse({
      body: {
        name: 'Clinician One',
        email: 'clinician@example.com',
        password: 'secure-pass',
        facilityId: 'facility-1',
        requestedRole: 'FACILITY_ADMIN',
      },
    })
  );
});

test('login schema normalizes email and accepts an active facility selection', () => {
  const result = loginSchema.parse({
    body: {
      email: ' Clinician@Example.COM ',
      password: 'secret',
      activeFacilityId: 'facility-1',
    },
  });

  assert.equal(result.body.email, 'clinician@example.com');
  assert.equal(result.body.activeFacilityId, 'facility-1');
});

test('refresh schema accepts legacy facilityId selection during token rotation', () => {
  const result = refreshSchema.parse({
    body: {
      refreshToken: 'r'.repeat(32),
      facilityId: 'facility-1',
    },
  });

  assert.equal(result.body.refreshToken.length, 32);
  assert.equal(result.body.facilityId, 'facility-1');
});

test('refresh schema rejects short refresh tokens', () => {
  assert.throws(
    () => refreshSchema.parse({ body: { refreshToken: 'short' } }),
    /Too small/
  );
});
