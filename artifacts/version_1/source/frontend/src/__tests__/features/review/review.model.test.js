/**
 * Review Model Tests
 * File: review.model.test.js
 */

import {
  buildReviewQueueSummary,
  canUserReview,
  normalizeReviewQueueItem,
  normalizeReviewQueueResponse,
} from '@features/review';

describe('review.model', () => {
  it('normalizes sync conflicts as review queue items', () => {
    const item = normalizeReviewQueueItem({
      entityType: 'sync-conflict',
      entityId: 'sync-1',
      reviewStatus: 'CONFLICT',
      item: {
        id: 'sync-1',
        operation: 'save_admission_review_step',
        status: 'CONFLICT',
      },
      triage: {
        priority: 'urgent',
        syncConflict: {
          status: 'CONFLICT',
          preserveReviewedData: true,
          resolution: 'keep_server_record_and_route_client_payload_for_review',
        },
      },
    });

    expect(item.title).toContain('save_admission_review_step');
    expect(item.hasConflict).toBe(true);
    expect(item.triage.syncConflict.preserveReviewedData).toBe(true);
  });

  it('summarizes urgent, conflict, and dataset-ready counts', () => {
    const response = normalizeReviewQueueResponse({
      items: [
        {
          entityType: 'sync-conflict',
          entityId: 'sync-1',
          item: { operation: 'create_abg_test', status: 'CONFLICT' },
          triage: { priority: 'urgent', syncConflict: { status: 'CONFLICT' } },
        },
        {
          entityType: 'dataset-case',
          entityId: 'dataset-1',
          item: { reviewStatus: 'APPROVED_FOR_DATASET' },
          triage: {},
        },
      ],
      meta: { total: 2 },
    });

    expect(buildReviewQueueSummary(response.items)).toMatchObject({
      total: 2,
      urgent: 1,
      conflicts: 1,
      datasetReady: 1,
    });
  });

  it('allows only reviewer or governance users to access review workflows', () => {
    expect(canUserReview({ roles: ['SPECIALIST_REVIEWER'] })).toBe(true);
    expect(canUserReview({ permissions: ['review:write'] })).toBe(true);
    expect(canUserReview({ roles: ['CLINICIAN'], permissions: ['clinical:write'] })).toBe(false);
  });
});
