/**
 * New Patient Use Cases
 * File: newPatients.usecase.js
 */
import { handleError } from '@errors';
import { newPatientsApi } from './newPatients.api';
import {
  buildCreateNewPatientPayload,
  buildNewPatientReasonStepPayload,
  normalizeNewPatientDraft,
} from './newPatients.model';
import {
  loadNewPatientDrafts,
  removeNewPatientDraft,
  saveNewPatientDraft,
} from './newPatients.drafts';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const normalizeNewPatientDraftUseCase = async (draft, options) =>
  execute(async () => normalizeNewPatientDraft(draft, options));

const saveNewPatientDraftUseCase = async (draft, options) =>
  execute(async () => saveNewPatientDraft(draft, options));

const loadNewPatientDraftsUseCase = async () =>
  execute(async () => loadNewPatientDrafts());

const removeNewPatientDraftUseCase = async (idempotencyKey) =>
  execute(async () => removeNewPatientDraft(idempotencyKey));

const createNewPatientUseCase = async (draft, options) =>
  execute(async () => newPatientsApi.create(buildCreateNewPatientPayload(draft, options)));

const createNewPatientReasonStepUseCase = async (draft, options) =>
  execute(async () => newPatientsApi.createPatientReasonStep(buildNewPatientReasonStepPayload(draft, options)));

export {
  normalizeNewPatientDraftUseCase,
  saveNewPatientDraftUseCase,
  loadNewPatientDraftsUseCase,
  removeNewPatientDraftUseCase,
  createNewPatientUseCase,
  createNewPatientReasonStepUseCase,
};
