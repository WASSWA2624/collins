/**
 * useReviewQueue Hook
 * Redux bridge for reviewer queue workflows.
 * File: useReviewQueue.js
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectReviewActionLoadingById,
  selectReviewQueueErrorCode,
  selectReviewQueueFilters,
  selectReviewQueueItems,
  selectReviewQueueLoading,
  selectReviewQueueMeta,
} from '@store/selectors';
import { actions as reviewActions } from '@store/slices/review.slice';

const useReviewQueue = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectReviewQueueItems);
  const meta = useSelector(selectReviewQueueMeta);
  const filters = useSelector(selectReviewQueueFilters);
  const isLoading = useSelector(selectReviewQueueLoading);
  const actionLoadingById = useSelector(selectReviewActionLoadingById);
  const errorCode = useSelector(selectReviewQueueErrorCode);

  return {
    items,
    meta,
    filters,
    isLoading,
    actionLoadingById,
    errorCode,
    loadQueue: useCallback((params) => dispatch(reviewActions.loadReviewQueue(params)), [dispatch]),
    saveAction: useCallback((payload) => dispatch(reviewActions.saveReviewAction(payload)), [dispatch]),
    setFilters: useCallback((payload) => dispatch(reviewActions.setReviewFilters(payload)), [dispatch]),
    clearError: useCallback(() => dispatch(reviewActions.clearReviewError()), [dispatch]),
  };
};

export default useReviewQueue;
