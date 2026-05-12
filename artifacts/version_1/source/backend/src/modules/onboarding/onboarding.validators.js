import { z } from 'zod';
import {
  CLINICAL_SAFETY_ACKNOWLEDGEMENT,
  ONBOARDING_REQUESTABLE_ROLES,
  ONBOARDING_STEPS,
} from './onboarding.constants.js';

const onboardingStep = z.enum(ONBOARDING_STEPS);
const membershipRole = z.enum(ONBOARDING_REQUESTABLE_ROLES);

export const onboardingConfigSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const getOnboardingStateSchema = onboardingConfigSchema;

export const updateOnboardingStateSchema = z.object({
  body: z.object({
    currentStep: onboardingStep.optional(),
    completedSteps: z.array(onboardingStep).max(ONBOARDING_STEPS.length).optional(),
    selectedFacilityId: z.string().trim().min(1).max(191).nullable().optional(),
    requestedRole: membershipRole.nullable().optional(),
  }).strict().refine((value) => Object.keys(value).length > 0, {
    message: 'At least one onboarding state field is required',
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const acknowledgeClinicalSafetySchema = z.object({
  body: z.object({
    acknowledged: z.literal(true),
    acknowledgementVersion: z.literal(CLINICAL_SAFETY_ACKNOWLEDGEMENT.version).optional(),
    clientAcknowledgedAt: z.string().datetime({ offset: true }).optional(),
    deviceId: z.string().trim().min(1).max(120).optional(),
  }).strict(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
