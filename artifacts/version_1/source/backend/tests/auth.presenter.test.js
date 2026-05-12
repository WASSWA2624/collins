import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildAuthContext,
  resolveActiveFacilityContext,
  resolveRequestedFacilityId,
} from '../src/modules/auth/auth.presenter.js';

const user = {
  id: 'user-1',
  name: 'Clinician One',
  email: 'clinician@example.com',
  phone: null,
  status: 'ACTIVE',
};

const memberships = [
  {
    id: 'membership-1',
    facilityId: 'facility-1',
    role: 'CLINICIAN',
    status: 'APPROVED',
    facility: {
      id: 'facility-1',
      name: 'Central ICU',
      registryCode: 'CENTRAL',
      district: 'Kampala',
      region: 'Central',
      verificationStatus: 'VERIFIED',
    },
  },
  {
    id: 'membership-2',
    facilityId: 'facility-1',
    role: 'SPECIALIST_REVIEWER',
    status: 'APPROVED',
    facility: {
      id: 'facility-1',
      name: 'Central ICU',
      registryCode: 'CENTRAL',
      district: 'Kampala',
      region: 'Central',
      verificationStatus: 'VERIFIED',
    },
  },
];

test('builds reusable auth context with active facility, role summaries, and permissions', () => {
  const context = buildAuthContext({ user, memberships });

  assert.deepEqual(context.roles, ['CLINICIAN', 'SPECIALIST_REVIEWER']);
  assert.equal(context.activeFacility.facilityId, 'facility-1');
  assert.deepEqual(context.activeFacility.roles, ['CLINICIAN', 'SPECIALIST_REVIEWER']);
  assert.ok(context.permissions.includes('clinical:read'));
  assert.ok(context.permissions.includes('review:write'));
  assert.equal(context.user.activeFacility.facilityId, 'facility-1');
  assert.equal(context.user.memberships.length, 2);
  assert.equal(context.roleSummaries.length, 2);
});

test('chooses the first active facility for a non-admin user with multiple facilities', () => {
  const context = buildAuthContext({
    user,
    memberships: [
      memberships[0],
      {
        ...memberships[0],
        id: 'membership-3',
        facilityId: 'facility-2',
        facility: { ...memberships[0].facility, id: 'facility-2', name: 'North ICU' },
      },
    ],
  });

  assert.equal(context.activeFacility.facilityId, 'facility-1');
});

test('keeps platform admins in all-facilities scope when no explicit request is provided', () => {
  const context = buildAuthContext({
    user,
    memberships: [
      {
        ...memberships[0],
        role: 'PLATFORM_ADMIN',
      },
      {
        ...memberships[0],
        id: 'membership-3',
        facilityId: 'facility-2',
        role: 'FACILITY_ADMIN',
        facility: { ...memberships[0].facility, id: 'facility-2', name: 'North ICU' },
      },
    ],
  });

  assert.equal(context.activeFacility, null);
  assert.ok(context.roles.includes('PLATFORM_ADMIN'));
});

test('rejects requested active facility outside approved memberships', () => {
  assert.throws(
    () => resolveActiveFacilityContext(memberships.map((membership) => ({
      ...membership,
      permissions: [],
    })), 'facility-2'),
    /requested facility/
  );
});

test('resolves activeFacilityId before legacy facilityId', () => {
  assert.equal(resolveRequestedFacilityId({
    activeFacilityId: 'facility-1',
    facilityId: 'facility-2',
  }), 'facility-1');
  assert.equal(resolveRequestedFacilityId({ facilityId: 'facility-2' }), 'facility-2');
});
