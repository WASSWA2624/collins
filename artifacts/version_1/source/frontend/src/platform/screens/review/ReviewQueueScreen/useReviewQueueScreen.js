/**
 * useReviewQueueScreen
 * Shared screen logic for review queue platforms.
 * File: useReviewQueueScreen.js
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth, useI18n, useReviewQueue } from '@hooks';
import { canSelectFacilityScope } from '@config/accessControl';
import { buildReviewQueueSummary, canUserReview, ENTITY_TYPE_OPTIONS, REVIEW_ACTIONS } from '@features/review';
import { REVIEW_QUEUE_TEST_IDS } from './types';

const getFacilityId = (auth) => auth.activeFacilityId || auth.user?.activeFacility?.facilityId || auth.user?.activeFacility?.id || null;

const useReviewQueueScreen = () => {
  const { t } = useI18n();
  const auth = useAuth();
  const canReview = canUserReview({
    ...(auth.user || {}),
    activeFacility: auth.activeFacility || auth.user?.activeFacility,
    memberships: auth.memberships || auth.user?.memberships,
    permissions: auth.permissions || auth.user?.permissions,
    roles: auth.roleKeys || auth.roles || auth.user?.roles,
  });
  const canSelectFacility = canSelectFacilityScope(auth.user);
  const facilityId = canSelectFacility ? getFacilityId(auth) : null;
  const {
    items,
    meta,
    filters,
    isLoading,
    actionLoadingById,
    errorCode,
    loadQueue,
    saveAction,
  } = useReviewQueue();
  const [selectedEntityType, setSelectedEntityType] = useState(filters.entityType || '');
  const [commentsById, setCommentsById] = useState({});

  const requestParams = useMemo(() => ({
    ...(selectedEntityType ? { entityType: selectedEntityType } : {}),
    ...(facilityId ? { facilityId } : {}),
    page: 1,
    limit: 50,
  }), [facilityId, selectedEntityType]);

  const refresh = useCallback(() => {
    if (!canReview) return null;
    return loadQueue(requestParams);
  }, [canReview, loadQueue, requestParams]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setComment = useCallback((entityId, value) => {
    setCommentsById((current) => ({
      ...current,
      [entityId]: value,
    }));
  }, []);

  const handleAction = useCallback((item, action) => {
    const comment = commentsById[item.entityId] || '';
    return saveAction({
      entityType: item.entityType,
      entityId: item.entityId,
      action,
      comment,
      item,
    });
  }, [commentsById, saveAction]);

  const filterOptions = useMemo(
    () => ENTITY_TYPE_OPTIONS.map((option) => ({
      ...option,
      label: t(option.labelKey),
    })),
    [t]
  );

  return {
    t,
    testIds: REVIEW_QUEUE_TEST_IDS,
    canReview,
    facilityId,
    items,
    meta,
    summary: buildReviewQueueSummary(items),
    filters,
    filterOptions,
    selectedEntityType,
    setSelectedEntityType,
    commentsById,
    setComment,
    isLoading,
    actionLoadingById,
    errorCode,
    refresh,
    actions: REVIEW_ACTIONS,
    handleAction,
  };
};

export default useReviewQueueScreen;
