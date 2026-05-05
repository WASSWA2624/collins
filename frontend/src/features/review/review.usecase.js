/**
 * Review Use Cases
 * File: review.usecase.js
 */

import { handleError } from '@errors';
import { normalizeReviewQueueItem, normalizeReviewQueueResponse, REVIEW_ACTIONS } from './review.model';
import { listReviewQueueApi, reviewActionApi } from './review.api';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const unwrap = (res) => res?.data ?? res;

const listReviewQueueUseCase = async (params = {}) =>
  execute(async () => {
    const response = await listReviewQueueApi(params);
    const body = unwrap(response);
    return normalizeReviewQueueResponse({
      items: body?.data || [],
      meta: body?.meta || {},
    });
  });

const buildReviewActionPayload = ({ action, comment, item }) => {
  const note = typeof comment === 'string' ? comment.trim() : '';
  const payload = {};

  if (note) payload.comment = note;
  if (action === REVIEW_ACTIONS.APPROVE && item?.triage?.needsOverrideReason) {
    payload.overrideReason = note;
  }
  if (action === REVIEW_ACTIONS.EXCLUDE && note) {
    payload.reason = note;
  }
  if (action === REVIEW_ACTIONS.REQUEST_CORRECTION) {
    payload.returnedToClinician = true;
  }
  if (action === REVIEW_ACTIONS.TRIAGE) {
    payload.triagePriority = 'deferred';
  }

  return payload;
};

const saveReviewActionUseCase = async ({ entityType, entityId, action, comment, item } = {}) =>
  execute(async () => {
    if (!entityType || !entityId || !action) throw new Error('review_action_required');
    const payload = buildReviewActionPayload({ action, comment, item });
    const response = await reviewActionApi({ entityType, entityId, action, payload });
    const body = unwrap(response);
    return normalizeReviewQueueItem({
      entityType,
      entityId,
      item: body?.data?.item || body?.item || {},
    });
  });

export { buildReviewActionPayload, listReviewQueueUseCase, saveReviewActionUseCase };
