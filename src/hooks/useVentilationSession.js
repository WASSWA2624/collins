/**
 * useVentilationSession Hook
 * UI gateway for ventilation session persistence (local-only).
 * File: useVentilationSession.js
 */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectVentilationErrorCode,
  selectVentilationHydratedAt,
  selectVentilationHydrating,
  selectVentilationInputs,
  selectVentilationRecommendationSummary,
  selectVentilationSessionId,
} from '@store/selectors';
import { actions as ventilationActions } from '@store/slices/ventilation.slice';

const useVentilationSession = () => {
  const dispatch = useDispatch();

  const sessionId = useSelector(selectVentilationSessionId);
  const inputs = useSelector(selectVentilationInputs);
  const recommendationSummary = useSelector(selectVentilationRecommendationSummary);
  const isHydrating = useSelector(selectVentilationHydrating);
  const hydratedAt = useSelector(selectVentilationHydratedAt);
  const errorCode = useSelector(selectVentilationErrorCode);

  return {
    sessionId,
    inputs,
    recommendationSummary,
    isHydrating,
    hydratedAt,
    errorCode,
    startSession: useCallback((id) => dispatch(ventilationActions.startSession(id)), [dispatch]),
    setInputs: useCallback((nextInputs) => dispatch(ventilationActions.setInputs(nextInputs)), [dispatch]),
    setRecommendationSummary: useCallback(
      (summary) => dispatch(ventilationActions.setRecommendationSummary(summary)),
      [dispatch]
    ),
    hydrate: useCallback(() => dispatch(ventilationActions.hydrateVentilationSession()), [dispatch]),
    persistDraft: useCallback(() => dispatch(ventilationActions.persistVentilationSessionDraft()), [dispatch]),
    clearDraft: useCallback(() => dispatch(ventilationActions.clearVentilationSessionDraft()), [dispatch]),
    appendToHistory: useCallback(() => dispatch(ventilationActions.appendVentilationSessionToHistory()), [dispatch]),
    clearError: useCallback(() => dispatch(ventilationActions.clearVentilationError()), [dispatch]),
    resetSession: useCallback(() => dispatch(ventilationActions.resetSession()), [dispatch]),
  };
};

export default useVentilationSession;

