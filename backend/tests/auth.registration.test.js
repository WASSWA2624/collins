import test from 'node:test';
import assert from 'node:assert/strict';
import { prisma } from './helpers/prisma.js';
import { registerUser } from '../src/modules/auth/auth.service.js';

const installRegistrationPrismaMock = (t) => {
  const originals = {
    user: prisma.user,
    $transaction: prisma.$transaction,
  };
  t.after(() => {
    prisma.user = originals.user;
    prisma.$transaction = originals.$transaction;
  });

  const calls = {
    createdFacility: null,
    createdMembership: null,
    createdOnboardingState: null,
    auditActions: [],
  };
  let onboardingState = null;

  const tx = {
    user: {
      create: async ({ data }) => ({
        id: 'user-1',
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        status: 'ACTIVE',
        createdAt: new Date('2026-05-06T00:00:00.000Z'),
        updatedAt: new Date('2026-05-06T00:00:00.000Z'),
      }),
    },
    facility: {
      findFirst: async () => null,
      create: async ({ data }) => {
        calls.createdFacility = {
          id: 'facility-1',
          registryCode: null,
          verificationStatus: 'PENDING',
          ...data,
        };
        return calls.createdFacility;
      },
    },
    facilityMembership: {
      create: async ({ data }) => {
        calls.createdMembership = data;
        return {
          id: 'membership-1',
          approvedByUserId: null,
          ...data,
          facility: calls.createdFacility,
        };
      },
      findMany: async ({ where }) => {
        if (
          where?.userId !== 'user-1' ||
          where?.status !== 'APPROVED' ||
          calls.createdMembership?.status !== 'APPROVED'
        ) {
          return [];
        }

        return [{
          id: 'membership-1',
          facilityId: calls.createdMembership.facilityId,
          role: calls.createdMembership.role,
          status: calls.createdMembership.status,
          facility: calls.createdFacility,
        }];
      },
    },
    onboardingState: {
      create: async ({ data }) => {
        calls.createdOnboardingState = data;
        onboardingState = {
          id: 'onboarding-1',
          userId: data.userId,
          status: 'NOT_STARTED',
          currentStep: 'WELCOME',
          completedStepsJson: [],
          selectedFacilityId: data.selectedFacilityId || null,
          requestedRole: data.requestedRole || null,
          clinicalSafetyAcknowledgedAt: null,
          clinicalSafetyAcknowledgementVersion: null,
          clinicalSafetyStatementHash: null,
          completedAt: null,
        };
        return onboardingState;
      },
      findUnique: async () => onboardingState,
    },
    userSettings: {
      findUnique: async () => null,
    },
    refreshSession: {
      create: async () => ({
        id: 'session-1',
        expiresAt: new Date(Date.now() + 3600_000),
      }),
    },
    auditLog: {
      create: async ({ data }) => {
        calls.auditActions.push(data.action);
        return data;
      },
    },
  };

  prisma.user = { findUnique: async () => null };
  prisma.$transaction = async (work) => work(tx);

  return calls;
};

const registrationPayload = (overrides = {}) => ({
  name: 'Clinician One',
  email: 'clinician@example.com',
  password: 'secure-pass',
  facilityName: 'Mulago National Referral Hospital',
  facilityDistrict: 'Kampala',
  facilityRegion: 'Central',
  facilityType: 'National referral hospital',
  facilityOwnership: 'Government',
  requestedRole: 'CLINICIAN',
  ...overrides,
});

test('registerUser auto-approves default clinical facility access from registration', async (t) => {
  const calls = installRegistrationPrismaMock(t);

  const payload = await registerUser(registrationPayload());

  assert.equal(calls.createdFacility.name, 'Mulago National Referral Hospital');
  assert.equal(calls.createdFacility.verificationStatus, 'PENDING');
  assert.deepEqual(calls.createdMembership, {
    userId: 'user-1',
    facilityId: 'facility-1',
    role: 'CLINICIAN',
    status: 'APPROVED',
    approvedByUserId: 'user-1',
  });
  assert.equal(calls.createdOnboardingState.selectedFacilityId, 'facility-1');
  assert.equal(calls.createdOnboardingState.requestedRole, 'CLINICIAN');
  assert.ok(calls.auditActions.includes('FACILITY_CREATE_FROM_REGISTRATION'));
  assert.ok(calls.auditActions.includes('FACILITY_MEMBERSHIP_AUTO_APPROVE_REGISTRATION'));
  assert.ok(calls.auditActions.includes('AUTH_REGISTER'));
  assert.equal(payload.user.id, 'user-1');
  assert.equal(payload.user.onboardingState.selectedFacilityId, 'facility-1');
  assert.equal(payload.activeFacility.facilityId, 'facility-1');
  assert.deepEqual(payload.activeFacility.roles, ['CLINICIAN']);
  assert.ok(payload.user.permissions.includes('clinical:write'));
});

test('registerUser keeps elevated self-service role requests pending', async (t) => {
  const calls = installRegistrationPrismaMock(t);

  const payload = await registerUser(registrationPayload({
    requestedRole: 'FACILITY_ADMIN',
  }));

  assert.deepEqual(calls.createdMembership, {
    userId: 'user-1',
    facilityId: 'facility-1',
    role: 'FACILITY_ADMIN',
    status: 'PENDING',
  });
  assert.ok(calls.auditActions.includes('FACILITY_MEMBERSHIP_REQUEST'));
  assert.equal(payload.activeFacility, null);
  assert.deepEqual(payload.roles, []);
});
