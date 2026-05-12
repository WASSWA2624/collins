/**
 * Review API
 * Backend review queue endpoints.
 * File: review.api.js
 */

import { endpoints } from '@config/endpoints';
import { apiClient } from '@services/api';

const appendQuery = (url, params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    query.set(key, String(value));
  });
  const text = query.toString();
  return text ? `${url}?${text}` : url;
};

const listReviewQueueApi = (params = {}) =>
  apiClient({
    url: appendQuery(endpoints.REVIEW.QUEUE, params),
    method: 'GET',
  });

const reviewActionApi = ({ entityType, entityId, action, payload }) => {
  const routeByAction = {
    approve: endpoints.REVIEW.APPROVE,
    request_correction: endpoints.REVIEW.REQUEST_CORRECTION,
    exclude: endpoints.REVIEW.EXCLUDE,
    triage: endpoints.REVIEW.TRIAGE,
  };
  const route = routeByAction[action];
  if (!route) throw new Error('review_action_unsupported');

  return apiClient({
    url: route(entityType, entityId),
    method: 'POST',
    body: payload || {},
  });
};

export { listReviewQueueApi, reviewActionApi };
