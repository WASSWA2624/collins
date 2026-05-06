import test from 'node:test';
import assert from 'node:assert/strict';
import { prisma } from '../src/config/prisma.js';
import { registerUser } from '../src/modules/auth/auth.service.js';

test('registerUser creates a pending facility membership when affiliation is supplied', async (t) => {
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
        calls.createdFacility = data;
        return {
          id: 'facility-1',
          registryCode: null,
          verificationStatus: 'PENDING',
          ...data,
        };
      },
    },
    facilityMembership: {
      create: async ({ data }) => {
        calls.createdMembership = data;
        return {
          id: 'membership-1',
          ...data,
          facility: { id: data.facilityId, name: 'Mulago National Referral Hospital' },
        };
      },
      findMany: async () => [],
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

  const payload = await registerUser({
    name: 'Clinician One',
    email: 'clinician@example.com',
    password: 'secure-pass',
    facilityName: 'Mulago National Referral Hospital',
    facilityDistrict: 'Kampala',
    facilityRegion: 'Central',
    facilityType: 'National referral hospital',
    facilityOwnership: 'Government',
    requestedRole: 'CLINICIAN',
  });

  assert.equal(calls.createdFacility.name, 'Mulago National Referral Hospital');
  assert.equal(calls.createdFacility.verificationStatus, undefined);
  assert.deepEqual(calls.createdMembership, {
    userId: 'user-1',
    facilityId: 'facility-1',
    role: 'CLINICIAN',
    status: 'PENDING',
  });
  assert.equal(calls.createdOnboardingState.selectedFacilityId, 'facility-1');
  assert.equal(calls.createdOnboardingState.requestedRole, 'CLINICIAN');
  assert.ok(calls.auditActions.includes('FACILITY_CREATE_FROM_REGISTRATION'));
  assert.ok(calls.auditActions.includes('FACILITY_MEMBERSHIP_REQUEST'));
  assert.ok(calls.auditActions.includes('AUTH_REGISTER'));
  assert.equal(payload.user.id, 'user-1');
  assert.equal(payload.user.onboardingState.selectedFacilityId, 'facility-1');
});
