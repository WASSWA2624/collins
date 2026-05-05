/**
 * useHistoryScreen
 * Shared logic for Tracking screen.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import useVentilationSession from '@hooks/useVentilationSession';
import {
  getTrackingAdmissionUseCase,
  listTrackingAdmissionsUseCase,
} from '@features/tracking';

const normalizeErrorCode = (error, fallback = 'TRACKING_LOAD_FAILED') => {
  if (typeof error === 'string' && error.trim()) return error.trim();
  if (typeof error?.code === 'string' && error.code.trim()) return error.code.trim();
  if (typeof error?.errorCode === 'string' && error.errorCode.trim()) return error.errorCode.trim();
  return fallback;
};

export default function useHistoryScreen() {
  const {
    sessionId,
    inputs,
    recommendationSummary,
    assessmentCurrentStep,
    monitoringTimeSeries,
  } = useVentilationSession();

  const [rows, setRows] = useState([]);
  const [trackingErrorCode, setTrackingErrorCode] = useState(null);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState(null);
  const [selectedTracking, setSelectedTracking] = useState(null);
  const [detailErrorCode, setDetailErrorCode] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const loadTracking = useCallback(async () => {
    setIsTrackingLoading(true);
    setTrackingErrorCode(null);
    try {
      const result = await listTrackingAdmissionsUseCase({ status: 'ACTIVE' });
      setRows(result?.items ?? []);
    } catch (error) {
      setRows([]);
      setTrackingErrorCode(normalizeErrorCode(error));
    } finally {
      setIsTrackingLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTracking();
  }, [loadTracking]);

  const handleViewDetails = useCallback(async (row) => {
    const admissionId = row?.admissionId || row?.id;
    if (!admissionId) return;
    setSelectedAdmissionId(admissionId);
    setSelectedTracking(null);
    setDetailErrorCode(null);
    setIsDetailLoading(true);
    try {
      const tracking = await getTrackingAdmissionUseCase(admissionId);
      setSelectedTracking(tracking);
    } catch (error) {
      setDetailErrorCode(normalizeErrorCode(error, 'TRACKING_DETAIL_LOAD_FAILED'));
    } finally {
      setIsDetailLoading(false);
    }
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedAdmissionId(null);
    setSelectedTracking(null);
    setDetailErrorCode(null);
  }, []);

  const localDraft = useMemo(() => {
    if (!sessionId || (!inputs && !recommendationSummary)) return null;
    return {
      sessionId,
      hasInputs: Boolean(inputs),
      hasRecommendation: Boolean(recommendationSummary),
      hasMonitoring: Array.isArray(monitoringTimeSeries) && monitoringTimeSeries.length > 0,
      assessmentCurrentStep: typeof assessmentCurrentStep === 'number' ? assessmentCurrentStep : 0,
    };
  }, [assessmentCurrentStep, inputs, monitoringTimeSeries, recommendationSummary, sessionId]);

  const activeFacility = rows[0]
    ? {
        id: rows[0].facilityId,
        name: rows[0].facilityName,
      }
    : null;

  return {
    list: rows,
    rows,
    activeFacility,
    isEmpty: rows.length === 0,
    isHistoryLoading: isTrackingLoading,
    historyErrorCode: trackingErrorCode,
    isCorrupt: false,
    localDraft,
    selectedAdmissionId,
    selectedTracking,
    isDetailLoading,
    detailErrorCode,
    handleRefresh: loadTracking,
    handleViewDetails,
    handleCloseDetails,
  };
}
