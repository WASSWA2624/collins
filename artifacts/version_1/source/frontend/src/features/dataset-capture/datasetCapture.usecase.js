/**
 * Dataset Capture Use Cases
 * File: datasetCapture.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { createDatasetImportApi, parseDatasetNoteApi } from './datasetCapture.api';
import {
  buildDatasetCaptureSubmission,
  parseDatasetCaptureNote,
  validateDatasetCaptureFieldValues,
} from './datasetCapture.model';

const unwrap = (res) => res?.data?.data ?? res?.data ?? null;

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const parseDatasetCaptureNoteUseCase = async ({ noteText, facilityId } = {}) =>
  execute(async () => {
    const local = parseDatasetCaptureNote(noteText);
    if (!facilityId) return { ...local, previewSource: 'local' };

    try {
      const response = await parseDatasetNoteApi({ noteText, facilityId });
      const server = unwrap(response);
      if (!server?.structuredPreviewJson) return { ...local, previewSource: 'local' };
      return {
        ...local,
        structuredPreviewJson: server.structuredPreviewJson,
        missingFields: server.missingFields || local.missingFields,
        noteStorage: server.noteStorage || local.noteStorage,
        previewSource: 'server',
      };
    } catch {
      return { ...local, previewSource: 'local' };
    }
  });

const submitDatasetCaptureCandidateUseCase = async (payload) =>
  execute(async () => {
    const validation = validateDatasetCaptureFieldValues(payload?.fieldValues || {});
    if (!validation.valid) {
      const error = new Error('Dataset capture validation failed');
      error.code = 'DATASET_CAPTURE_VALIDATION_FAILED';
      error.validation = validation;
      throw error;
    }

    const submission = buildDatasetCaptureSubmission(payload);
    const request = {
      url: endpoints.DATASET_IMPORTS.CREATE,
      method: 'POST',
      body: submission,
    };

    const queued = await queueRequestIfOffline(request);
    if (queued) {
      return {
        queued: true,
        datasetCase: null,
        syncStatus: 'waiting_to_sync',
        clientRecordId: submission.clientRecordId,
      };
    }

    const response = await createDatasetImportApi(submission);
    const data = unwrap(response);
    const datasetCase = data?.datasetCase || data || null;
    return {
      queued: false,
      datasetCase,
      syncStatus: datasetCase?.syncStatus || data?.syncStatus || 'synced',
      clientRecordId: submission.clientRecordId,
    };
  });

export {
  parseDatasetCaptureNoteUseCase,
  submitDatasetCaptureCandidateUseCase,
};
