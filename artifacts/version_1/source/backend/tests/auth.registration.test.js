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
    selectedFacility: null,
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
      findUnique: async ({ where }) => {
        if (where?.id !== 'facility-1') return null;
        calls.selectedFacility = {
          id: 'facility-1',
          name: 'Mulago National Referral Hospital',
          registryCode: null,
          district: 'Kampala',
          region: 'Central',
          verificationStatus: 'VERIFIED',
        };
        return calls.selectedFacility;
      },
      findFirst: async () => null,
      create: async ({ data }) => {
        calls.selectedFacility = {
          id: 'facility-1',
          registryCode: null,
          verificationStatus: 'PENDING',
          ...data,
        };
        return calls.selectedFacility;
      },
    },
    facilityMembership: {
      create: async ({ data }) => {
        calls.createdMembership = data;
        return {
          id: 'membership-1',
          approvedByUserId: null,
          ...data,
          facility: calls.selectedFacility,
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
          facility: calls.selectedFacility,
        }];
      },
    },
    onboardingState: {
      create: async ({ data }) => {
        calls.createdOnboardingState = data;
        onboardingState = {
          id: 'onboarding-1',
          userId: data.userId,
          status: data.status || 'NOT_STARTED',
          currentStep: data.currentStep || 'WELCOME',
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
  facilityId: 'facility-1',
  requestedRole: 'CLINICIAN',
  ...overrides,
});

test('registerUser creates an account with an approved selected facility membership', async (t) => {
  const calls = installRegistrationPrismaMock(t);

  const payload = await registerUser(registrationPayload());

  assert.equal(calls.selectedFacility.id, 'facility-1');
  assert.equal(calls.createdMembership.facilityId, 'facility-1');
  assert.equal(calls.createdMembership.role, 'CLINICIAN');
  assert.equal(calls.createdMembership.status, 'APPROVED');
  assert.equal(calls.createdOnboardingState.selectedFacilityId, 'facility-1');
  assert.equal(calls.createdOnboardingState.requestedRole, 'CLINICIAN');
  assert.equal(calls.createdOnboardingState.status, 'IN_PROGRESS');
  assert.equal(calls.createdOnboardingState.currentStep, 'CLINICAL_SAFETY');
  assert.equal(calls.auditActions.includes('FACILITY_CREATE_FROM_REGISTRATION'), false);
  assert.equal(calls.auditActions.includes('FACILITY_MEMBERSHIP_AUTO_APPROVE_REGISTRATION'), true);
  assert.ok(calls.auditActions.includes('AUTH_REGISTER'));
  assert.equal(payload.user.id, 'user-1');
  assert.equal(payload.user.onboardingState.selectedFacilityId, 'facility-1');
  assert.equal(payload.activeFacility.facilityId, 'facility-1');
  assert.deepEqual(payload.roles, ['CLINICIAN']);
});

test('registerUser rejects an unknown registration facility', async (t) => {
  const calls = installRegistrationPrismaMock(t);

  await assert.rejects(
    () => registerUser(registrationPayload({ facilityId: 'facility-missing' })),
    /Facility not found/
  );
  assert.equal(calls.createdMembership, null);
});
