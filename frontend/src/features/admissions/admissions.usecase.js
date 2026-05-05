/**
 * Admissions Use Cases
 * File: admissions.usecase.js
 */
import { handleError } from '@errors';
import { admissionsApi } from './admissions.api';
import {
  buildCreateAdmissionPayload,
  buildPatientReasonStepPayload,
  normalizeAdmissionDraft,
} from './admissions.model';
import {
  loadAdmissionDrafts,
  removeAdmissionDraft,
  saveAdmissionDraft,
} from './admissions.drafts';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const normalizeAdmissionDraftUseCase = async (draft, options) =>
  execute(async () => normalizeAdmissionDraft(draft, options));

const saveAdmissionDraftUseCase = async (draft, options) =>
  execute(async () => saveAdmissionDraft(draft, options));

const loadAdmissionDraftsUseCase = async () =>
  execute(async () => loadAdmissionDrafts());

const removeAdmissionDraftUseCase = async (idempotencyKey) =>
  execute(async () => removeAdmissionDraft(idempotencyKey));

const createAdmissionUseCase = async (draft, options) =>
  execute(async () => admissionsApi.create(buildCreateAdmissionPayload(draft, options)));

const createAdmissionPatientReasonStepUseCase = async (draft, options) =>
  execute(async () => admissionsApi.createPatientReasonStep(buildPatientReasonStepPayload(draft, options)));

export {
  normalizeAdmissionDraftUseCase,
  saveAdmissionDraftUseCase,
  loadAdmissionDraftsUseCase,
  removeAdmissionDraftUseCase,
  createAdmissionUseCase,
  createAdmissionPatientReasonStepUseCase,
};
