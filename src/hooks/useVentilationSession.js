/**
 * useVentilationSession Hook
 * UI gateway for ventilation session persistence (local-only).
 * File: useVentilationSession.js
 */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAssessmentCurrentStep,
  selectAssessmentRecommendationSource,
  selectMonitoringTimeSeries,
  selectVentilationErrorCode,
  selectVentilationHistoryErrorCode,
  selectVentilationHistoryLoading,
  selectVentilationHydratedAt,
  selectVentilationHydrating,
  selectVentilationInputs,
  selectVentilationRecommendationSummary,
  selectVentilationSessionHistory,
  selectVentilationSessionId,
} from '@store/selectors';
import { actions as ventilationActions } from '@store/slices/ventilation.slice';

const useVentilationSession = () => {
  const dispatch = useDispatch();

  const sessionId = useSelector(selectVentilationSessionId);
  const inputs = useSelector(selectVentilationInputs);
  const recommendationSummary = useSelector(selectVentilationRecommendationSummary);
  const assessmentCurrentStep = useSelector(selectAssessmentCurrentStep);
  const assessmentRecommendationSource = useSelector(selectAssessmentRecommendationSource);
  const monitoringTimeSeries = useSelector(selectMonitoringTimeSeries);
  const isHydrating = useSelector(selectVentilationHydrating);
  const hydratedAt = useSelector(selectVentilationHydratedAt);
  const errorCode = useSelector(selectVentilationErrorCode);
  const sessionHistory = useSelector(selectVentilationSessionHistory);
  const historyErrorCode = useSelector(selectVentilationHistoryErrorCode);
  const isHistoryLoading = useSelector(selectVentilationHistoryLoading);

  return {
    sessionId,
    inputs,
    recommendationSummary,
    assessmentCurrentStep,
    assessmentRecommendationSource,
    monitoringTimeSeries,
    isHydrating,
    hydratedAt,
    errorCode,
    sessionHistory,
    historyErrorCode,
    isHistoryLoading,
    startSession: useCallback((id) => dispatch(ventilationActions.startSession(id)), [dispatch]),
    setInputs: useCallback((nextInputs) => dispatch(ventilationActions.setInputs(nextInputs)), [dispatch]),
    setRecommendationSummary: useCallback(
      (summary) => dispatch(ventilationActions.setRecommendationSummary(summary)),
      [dispatch]
    ),
    setAssessmentStep: useCallback((step) => dispatch(ventilationActions.setAssessmentStep(step)), [dispatch]),
    setAssessmentRecommendationSource: useCallback(
      (src) => dispatch(ventilationActions.setAssessmentRecommendationSource(src)),
      [dispatch]
    ),
    setMonitoringTimeSeries: useCallback(
      (series) => dispatch(ventilationActions.setMonitoringTimeSeries(series)),
      [dispatch]
    ),
    hydrate: useCallback(() => dispatch(ventilationActions.hydrateVentilationSession()), [dispatch]),
    persistDraft: useCallback(() => dispatch(ventilationActions.persistVentilationSessionDraft()), [dispatch]),
    clearDraft: useCallback(() => dispatch(ventilationActions.clearVentilationSessionDraft()), [dispatch]),
    appendToHistory: useCallback(() => dispatch(ventilationActions.appendVentilationSessionToHistory()), [dispatch]),
    loadHistory: useCallback(() => dispatch(ventilationActions.loadVentilationHistory()), [dispatch]),
    deleteFromHistory: useCallback(
      (id) => dispatch(ventilationActions.removeVentilationSessionFromHistory(id)),
      [dispatch]
    ),
    loadHistoryEntryIntoSession: useCallback(
      (entry) => {
        if (entry?.sessionId) {
          dispatch(ventilationActions.startSession(entry.sessionId));
          dispatch(ventilationActions.setInputs(entry.inputs ?? null));
          dispatch(ventilationActions.setRecommendationSummary(entry.recommendationSummary ?? null));
          if (typeof entry.assessmentCurrentStep === 'number') {
            dispatch(ventilationActions.setAssessmentStep(entry.assessmentCurrentStep));
          }
          if (entry.assessmentRecommendationSource === 'online_ai') {
            dispatch(ventilationActions.setAssessmentRecommendationSource('online_ai'));
          }
          if (Array.isArray(entry.monitoringTimeSeries)) {
            dispatch(ventilationActions.setMonitoringTimeSeries(entry.monitoringTimeSeries));
          }
        }
      },
      [dispatch]
    ),
    clearError: useCallback(() => dispatch(ventilationActions.clearVentilationError()), [dispatch]),
    resetSession: useCallback(() => dispatch(ventilationActions.resetSession()), [dispatch]),
  };
};

export default useVentilationSession;

