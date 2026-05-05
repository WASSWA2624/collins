import test from 'node:test';
import assert from 'node:assert/strict';
import { prisma } from '../src/config/prisma.js';
import {
  MODEL_GOVERNANCE_ROLES,
  READ_ROLES,
  WRITE_ROLES,
  assertAnyApprovedRole,
  assertFacilityRole,
  resolveFacilityScope,
} from '../src/utils/authorization.js';
import { MEMBERSHIP_ROLES, getPermissionsForRoles } from '../src/constants/roles.js';

const originalFacilityMembership = prisma.facilityMembership;

test.afterEach(() => {
  prisma.facilityMembership = originalFacilityMembership;
});

const useMemberships = (memberships) => {
  prisma.facilityMembership = {
    count: async ({ where }) => memberships.filter((membership) => (
      membership.userId === where.userId
      && membership.status === where.status
      && (
        typeof where.role === 'string'
          ? membership.role === where.role
          : where.role?.in?.includes(membership.role)
      )
    )).length,
    findFirst: async ({ where }) => memberships.find((membership) => (
      membership.userId === where.userId
      && membership.facilityId === where.facilityId
      && membership.status === where.status
      && where.role.in.includes(membership.role)
    )) || null,
    findMany: async ({ where }) => memberships.filter((membership) => (
      membership.userId === where.userId && membership.status === where.status
    )),
  };
};

test('assertFacilityRole allows approved facility members for requested roles', async () => {
  useMemberships([{
    id: 'm1',
    userId: 'user-1',
    facilityId: 'facility-1',
    role: MEMBERSHIP_ROLES.CLINICIAN,
    status: 'APPROVED',
  }]);

  const membership = await assertFacilityRole('user-1', 'facility-1', WRITE_ROLES);
  assert.equal(membership.id, 'm1');
});

test('assertFacilityRole rejects read-only members for writes', async () => {
  useMemberships([{
    id: 'm1',
    userId: 'user-1',
    facilityId: 'facility-1',
    role: MEMBERSHIP_ROLES.READ_ONLY_REVIEWER,
    status: 'APPROVED',
  }]);

  await assert.rejects(
    () => assertFacilityRole('user-1', 'facility-1', WRITE_ROLES),
    { status: 403 }
  );
});

test('resolveFacilityScope requires explicit facility when user has multiple active facilities', async () => {
  useMemberships([
    {
      id: 'm1',
      userId: 'user-1',
      facilityId: 'facility-1',
      role: MEMBERSHIP_ROLES.CLINICIAN,
      status: 'APPROVED',
    },
    {
      id: 'm2',
      userId: 'user-1',
      facilityId: 'facility-2',
      role: MEMBERSHIP_ROLES.CLINICIAN,
      status: 'APPROVED',
    },
  ]);

  await assert.rejects(
    () => resolveFacilityScope('user-1', undefined, READ_ROLES),
    { status: 403 }
  );
});

test('platform administrators can resolve global facility scope', async () => {
  useMemberships([{
    id: 'm1',
    userId: 'admin-1',
    facilityId: 'facility-1',
    role: MEMBERSHIP_ROLES.PLATFORM_ADMIN,
    status: 'APPROVED',
  }]);

  const scope = await resolveFacilityScope('admin-1', undefined, READ_ROLES);
  assert.equal(scope, undefined);
});

test('model governance role exposes model governance permission and passes system role check', async () => {
  useMemberships([{
    id: 'm1',
    userId: 'model-governor-1',
    facilityId: 'facility-1',
    role: MEMBERSHIP_ROLES.MODEL_GOVERNANCE_OFFICER,
    status: 'APPROVED',
  }]);

  await assertAnyApprovedRole('model-governor-1', MODEL_GOVERNANCE_ROLES);
  assert.deepEqual(getPermissionsForRoles([MEMBERSHIP_ROLES.MODEL_GOVERNANCE_OFFICER]), [
    'clinical:read',
    'model:govern',
  ]);
});
