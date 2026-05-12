import test from 'node:test';
import assert from 'node:assert/strict';
import { prisma } from './helpers/prisma.js';
import { assignManagedUserMemberships, updateManagedUserStatus } from '../src/modules/admin/admin.service.js';
import {
  adminUserListSchema,
  assignManagedUserMembershipsSchema,
  createManagedUserSchema,
  updateManagedUserStatusSchema,
} from '../src/modules/admin/admin.validators.js';

const originals = {
  facilityMembership: prisma.facilityMembership,
  user: prisma.user,
  facility: prisma.facility,
  $transaction: prisma.$transaction,
};

test.afterEach(() => {
  prisma.facilityMembership = originals.facilityMembership;
  prisma.user = originals.user;
  prisma.facility = originals.facility;
  prisma.$transaction = originals.$transaction;
});

test('admin user-management validators accept search, create, and assignment contracts', () => {
  assert.equal(adminUserListSchema.safeParse({
    body: {},
    params: {},
    query: { q: 'Kampala approved clinician', role: 'CLINICIAN', page: '1', limit: '20' },
  }).success, true);

  assert.equal(createManagedUserSchema.safeParse({
    body: {
      name: 'Clinician One',
      email: 'clinician@example.com',
      password: 'temporary-pass',
      memberships: [{ facilityId: 'facility-1', role: 'CLINICIAN' }],
    },
    params: {},
    query: {},
  }).success, true);

  assert.equal(assignManagedUserMembershipsSchema.safeParse({
    body: { facilityId: 'facility-1', roles: ['SPECIALIST_REVIEWER'], status: 'APPROVED' },
    params: { id: 'user-1' },
    query: {},
  }).success, true);

  assert.equal(updateManagedUserStatusSchema.safeParse({
    body: { status: 'SUSPENDED', reason: 'Policy review' },
    params: { id: 'user-1' },
    query: {},
  }).success, true);
});

test('facility administrators can approve capture and validation roles in their facility', async () => {
  let upsertData;
  let auditData;

  prisma.facilityMembership = {
    findMany: async ({ where }) => (where.userId === 'admin-1'
      ? [{ facilityId: 'facility-1', role: 'FACILITY_ADMIN', status: 'APPROVED' }]
      : []),
    count: async ({ where }) => (
      where.userId === 'admin-1' && where.role === 'PLATFORM_ADMIN' ? 0 : 0
    ),
    findFirst: async ({ where }) => (
      where.userId === 'admin-1' && where.facilityId === 'facility-1'
        ? { id: 'admin-membership-1', userId: 'admin-1', facilityId: 'facility-1', role: 'FACILITY_ADMIN' }
        : null
    ),
  };

  prisma.$transaction = async (callback) => callback({
    user: {
      findUnique: async ({ where }) => ({
        id: where.id,
        name: 'Clinician One',
        email: 'clinician@example.com',
        status: 'ACTIVE',
        facilityMemberships: [{
          id: 'membership-1',
          facilityId: 'facility-1',
          role: 'SPECIALIST_REVIEWER',
          status: 'APPROVED',
          approvedByUserId: 'admin-1',
          facility: { id: 'facility-1', name: 'Kampala ICU' },
          approvedBy: { id: 'admin-1', name: 'Admin One' },
        }],
      }),
    },
    facility: {
      findUnique: async ({ where }) => ({ id: where.id, name: 'Kampala ICU' }),
    },
    facilityMembership: {
      findUnique: async () => null,
      upsert: async ({ create }) => {
        upsertData = create;
        return { id: 'membership-1', ...create };
      },
    },
    auditLog: {
      create: async ({ data }) => {
        auditData = data;
        return { id: 'audit-1', ...data };
      },
    },
  });

  const result = await assignManagedUserMemberships('user-1', {
    facilityId: 'facility-1',
    roles: ['SPECIALIST_REVIEWER'],
    status: 'APPROVED',
  }, 'admin-1');

  assert.equal(upsertData.role, 'SPECIALIST_REVIEWER');
  assert.equal(upsertData.approvedByUserId, 'admin-1');
  assert.equal(auditData.action, 'ADMIN_USER_MEMBERSHIP_CREATE');
  assert.equal(result.user.capabilities.canCaptureData, true);
  assert.equal(result.user.capabilities.canValidateData, true);
});

test('facility administrators cannot grant platform administrator rights', async () => {
  prisma.facilityMembership = {
    findMany: async () => [{ facilityId: 'facility-1', role: 'FACILITY_ADMIN', status: 'APPROVED' }],
    count: async () => 0,
  };

  await assert.rejects(
    () => assignManagedUserMemberships('user-1', {
      facilityId: 'facility-1',
      roles: ['PLATFORM_ADMIN'],
      status: 'APPROVED',
    }, 'admin-1'),
    { status: 403 },
  );
});

test('platform administrators can suspend managed user accounts', async () => {
  let updateData;
  let auditData;

  prisma.facilityMembership = {
    count: async ({ where }) => (
      where.userId === 'platform-admin-1' && where.role === 'PLATFORM_ADMIN' ? 1 : 0
    ),
  };

  prisma.user = {
    findUnique: async ({ where }) => ({
      id: where.id,
      name: 'Clinician One',
      email: 'clinician@example.com',
      status: 'ACTIVE',
      facilityMemberships: [],
    }),
  };

  prisma.$transaction = async (callback) => callback({
    user: {
      update: async ({ data }) => {
        updateData = data;
        return {
          id: 'user-1',
          name: 'Clinician One',
          email: 'clinician@example.com',
          status: data.status,
          facilityMemberships: [],
        };
      },
    },
    auditLog: {
      create: async ({ data }) => {
        auditData = data;
        return { id: 'audit-1', ...data };
      },
    },
  });

  const result = await updateManagedUserStatus(
    'user-1',
    { status: 'SUSPENDED', reason: 'Policy review' },
    'platform-admin-1',
  );

  assert.equal(updateData.status, 'SUSPENDED');
  assert.equal(auditData.action, 'ADMIN_USER_STATUS_UPDATE');
  assert.equal(auditData.reason, 'Policy review');
  assert.equal(result.status, 'SUSPENDED');
});
