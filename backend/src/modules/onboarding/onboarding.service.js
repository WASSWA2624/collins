import { prisma } from '../../config/prisma.js';
import { writeAudit } from '../../utils/audit.js';
import { badRequest, notFound } from '../../utils/errors.js';
import {
  CLINICAL_SAFETY_ACKNOWLEDGEMENT,
  CLINICAL_SAFETY_STATEMENT_HASH,
  ONBOARDING_REQUESTABLE_ROLES,
  ONBOARDING_STEPS,
} from './onboarding.constants.js';

const selectedFacilitySelect = {
  id: true,
  registryCode: true,
  name: true,
  district: true,
  region: true,
  type: true,
  ownership: true,
  verificationStatus: true,
};

const onboardingStateSelect = {
  id: true,
  userId: true,
  status: true,
  currentStep: true,
  completedStepsJson: true,
  selectedFacilityId: true,
  requestedRole: true,
  clinicalSafetyAcknowledgedAt: true,
  clinicalSafetyAcknowledgementVersion: true,
  clinicalSafetyStatementHash: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true,
  selectedFacility: { select: selectedFacilitySelect },
};

const uniqueSteps = (steps = []) => ONBOARDING_STEPS.filter((step) => steps.includes(step));

const stateCompletedSteps = (state) => {
  if (!Array.isArray(state?.completedStepsJson)) return [];
  return uniqueSteps(state.completedStepsJson);
};

const buildStateResponse = (state, userId) => {
  const completedSteps = stateCompletedSteps(state);
  const acknowledged = Boolean(state?.clinicalSafetyAcknowledgedAt);

  return {
    id: state?.id || null,
    userId,
    status: state?.status || 'NOT_STARTED',
    currentStep: state?.currentStep || 'WELCOME',
    completedSteps,
    selectedFacilityId: state?.selectedFacilityId || null,
    selectedFacility: state?.selectedFacility || null,
    requestedRole: state?.requestedRole || null,
    clinicalSafetyAcknowledgement: {
      code: CLINICAL_SAFETY_ACKNOWLEDGEMENT.code,
      required: CLINICAL_SAFETY_ACKNOWLEDGEMENT.required,
      acknowledged,
      acknowledgedAt: state?.clinicalSafetyAcknowledgedAt || null,
      version: state?.clinicalSafetyAcknowledgementVersion || null,
      statementHash: state?.clinicalSafetyStatementHash || null,
      currentVersion: CLINICAL_SAFETY_ACKNOWLEDGEMENT.version,
      currentStatementHash: CLINICAL_SAFETY_STATEMENT_HASH,
    },
    completedAt: state?.completedAt || null,
    createdAt: state?.createdAt || null,
    updatedAt: state?.updatedAt || null,
  };
};

const findState = (tx, userId) => tx.onboardingState.findUnique({
  where: { userId },
  select: onboardingStateSelect,
});

const ensureState = async (tx, userId) => {
  const existing = await findState(tx, userId);
  if (existing) return existing;

  return tx.onboardingState.create({
    data: { userId },
    select: onboardingStateSelect,
  });
};

const assertFacilityExists = async (tx, facilityId) => {
  if (!facilityId) return null;
  const facility = await tx.facility.findUnique({
    where: { id: facilityId },
    select: selectedFacilitySelect,
  });
  if (!facility) throw notFound('Facility not found');
  return facility;
};

export const getOnboardingConfig = () => ({
  steps: ONBOARDING_STEPS,
  clinicalRecommendationsEnabled: false,
  supportedFacilitySelection: {
    searchEndpoint: '/facilities/search',
    createFacilityEndpoint: '/facilities',
    requestMembershipEndpointTemplate: '/facilities/:id/memberships/request',
    requestableRoles: ONBOARDING_REQUESTABLE_ROLES,
  },
  userSetup: {
    registerEndpoint: '/auth/register',
    loginEndpoint: '/auth/login',
    currentUserEndpoint: '/auth/me',
  },
  requiredAcknowledgements: [{
    ...CLINICAL_SAFETY_ACKNOWLEDGEMENT,
    statementHash: CLINICAL_SAFETY_STATEMENT_HASH,
  }],
});

export const getOnboardingState = async (userId) => {
  const state = await findState(prisma, userId);
  return buildStateResponse(state, userId);
};

export const createInitialOnboardingState = (tx, userId) => tx.onboardingState.create({
  data: { userId },
  select: onboardingStateSelect,
});

export const updateOnboardingState = async (userId, data, auditContext = {}) => prisma.$transaction(async (tx) => {
  const before = await ensureState(tx, userId);

  if (data.selectedFacilityId) {
    await assertFacilityExists(tx, data.selectedFacilityId);
  }

  const completedSteps = uniqueSteps(data.completedSteps || stateCompletedSteps(before));
  const nextCompletedSteps = data.currentStep === 'COMPLETED'
    ? uniqueSteps([...completedSteps, 'COMPLETED'])
    : completedSteps;
  const requestedCompletion = data.currentStep === 'COMPLETED' || nextCompletedSteps.includes('COMPLETED');
  const clinicalSafetyAcknowledgedAt = before.clinicalSafetyAcknowledgedAt;
  const selectedFacilityId = data.selectedFacilityId !== undefined
    ? data.selectedFacilityId
    : before.selectedFacilityId;

  if (requestedCompletion && !clinicalSafetyAcknowledgedAt) {
    throw badRequest('Clinical safety acknowledgement is required before onboarding can be completed');
  }

  if (requestedCompletion && !selectedFacilityId) {
    throw badRequest('Facility selection is required before onboarding can be completed');
  }

  const state = await tx.onboardingState.update({
    where: { userId },
    data: {
      ...(data.currentStep ? { currentStep: data.currentStep } : {}),
      ...(data.completedSteps || requestedCompletion ? { completedStepsJson: nextCompletedSteps } : {}),
      ...(data.selectedFacilityId !== undefined ? { selectedFacilityId: data.selectedFacilityId } : {}),
      ...(data.requestedRole !== undefined ? { requestedRole: data.requestedRole } : {}),
      status: requestedCompletion ? 'COMPLETED' : 'IN_PROGRESS',
      completedAt: requestedCompletion ? new Date() : null,
    },
    select: onboardingStateSelect,
  });

  await writeAudit({
    tx,
    ...auditContext,
    userId,
    facilityId: state.selectedFacilityId,
    action: 'ONBOARDING_STATE_UPDATE',
    entityType: 'OnboardingState',
    entityId: state.id,
    beforeJson: buildStateResponse(before, userId),
    afterJson: buildStateResponse(state, userId),
  });

  return buildStateResponse(state, userId);
});

export const acknowledgeClinicalSafety = async (userId, data, auditContext = {}) => prisma.$transaction(async (tx) => {
  const before = await ensureState(tx, userId);
  const completedSteps = uniqueSteps([...stateCompletedSteps(before), 'CLINICAL_SAFETY']);

  const state = await tx.onboardingState.update({
    where: { userId },
    data: {
      status: before.status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS',
      currentStep: before.currentStep === 'WELCOME' || before.currentStep === 'CLINICAL_SAFETY'
        ? 'USER_SETUP'
        : before.currentStep,
      completedStepsJson: completedSteps,
      clinicalSafetyAcknowledgedAt: new Date(),
      clinicalSafetyAcknowledgementVersion: CLINICAL_SAFETY_ACKNOWLEDGEMENT.version,
      clinicalSafetyStatementHash: CLINICAL_SAFETY_STATEMENT_HASH,
    },
    select: onboardingStateSelect,
  });

  await writeAudit({
    tx,
    ...auditContext,
    userId,
    facilityId: state.selectedFacilityId,
    action: 'ONBOARDING_CLINICAL_SAFETY_ACKNOWLEDGE',
    entityType: 'OnboardingState',
    entityId: state.id,
    beforeJson: buildStateResponse(before, userId),
    afterJson: {
      ...buildStateResponse(state, userId),
      clientAcknowledgedAt: data.clientAcknowledgedAt || null,
      deviceId: data.deviceId || null,
    },
  });

  return {
    state: buildStateResponse(state, userId),
    acknowledgement: {
      code: CLINICAL_SAFETY_ACKNOWLEDGEMENT.code,
      version: CLINICAL_SAFETY_ACKNOWLEDGEMENT.version,
      acknowledgedAt: state.clinicalSafetyAcknowledgedAt,
      statementHash: CLINICAL_SAFETY_STATEMENT_HASH,
    },
  };
});
