/**
 * useHistoryScreen
 * Shared logic for Tracking screen.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVentilationSession } from '@hooks';
import {
  filterTrackingRows,
  getTrackingAdmissionUseCase,
  listTrackingAdmissionsUseCase,
} from '@features/tracking';

const normalizeErrorCode = (error, fallback = 'TRACKING_LOAD_FAILED') => {
  if (typeof error === 'string' && error.trim()) return error.trim();
  if (typeof error?.code === 'string' && error.code.trim())
    return error.code.trim();
  if (typeof error?.errorCode === 'string' && error.errorCode.trim())
    return error.errorCode.trim();
  return fallback;
};

export default function useHistoryScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const {
    sessionId,
    inputs,
    recommendationSummary,
    assessmentCurrentStep,
    monitoringTimeSeries,
  } = useVentilationSession();

  const [rows, setRows] = useState([]);
  const [trackingErrorCode, setTrackingErrorCode] = useState(null);
  const [isTrackingLoading, setIsTrackingLoading] = useState(true);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState(null);
  const [selectedTracking, setSelectedTracking] = useState(null);
  const [detailErrorCode, setDetailErrorCode] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [autoOpenedAdmissionId, setAutoOpenedAdmissionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const admittedAdmissionId = useMemo(() => {
    const value = searchParams?.admissionId;
    if (Array.isArray(value)) return value[0] || '';
    return typeof value === 'string' ? value : '';
  }, [searchParams?.admissionId]);

  const showAdmittedBanner = useMemo(() => {
    const value = searchParams?.admitted;
    const admitted = Array.isArray(value) ? value[0] : value;
    return admitted === '1' && Boolean(admittedAdmissionId);
  }, [admittedAdmissionId, searchParams?.admitted]);

  const loadTrackingDetail = useCallback(async (admissionId) => {
    if (!admissionId) return;
    setSelectedTracking(null);
    setDetailErrorCode(null);
    setIsDetailLoading(true);
    try {
      const tracking = await getTrackingAdmissionUseCase(admissionId);
      setSelectedTracking(tracking);
    } catch (error) {
      setDetailErrorCode(
        normalizeErrorCode(error, 'TRACKING_DETAIL_LOAD_FAILED')
      );
    } finally {
      setIsDetailLoading(false);
    }
  }, []);

  const handleViewDetails = useCallback(async (row) => {
    const admissionId = row?.admissionId || row?.id;
    if (!admissionId) return;
    setSelectedAdmissionId(admissionId);
    await loadTrackingDetail(admissionId);
  }, [loadTrackingDetail]);

  const loadTracking = useCallback(async () => {
    setIsTrackingLoading(true);
    setTrackingErrorCode(null);
    try {
      const result = await listTrackingAdmissionsUseCase({
        status: 'ACTIVE',
        limit: 100,
      });
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

  const handleRefresh = useCallback(async () => {
    await loadTracking();
    if (selectedAdmissionId) {
      await loadTrackingDetail(selectedAdmissionId);
    }
  }, [loadTracking, loadTrackingDetail, selectedAdmissionId]);

  useEffect(() => {
    if (
      !admittedAdmissionId ||
      isTrackingLoading ||
      autoOpenedAdmissionId === admittedAdmissionId ||
      selectedAdmissionId === admittedAdmissionId
    ) {
      return;
    }

    const admittedRow = rows.find(
      (row) => (row?.admissionId || row?.id) === admittedAdmissionId
    );
    if (!admittedRow) return;

    setAutoOpenedAdmissionId(admittedAdmissionId);
    handleViewDetails(admittedRow);
  }, [
    admittedAdmissionId,
    autoOpenedAdmissionId,
    handleViewDetails,
    isTrackingLoading,
    rows,
    selectedAdmissionId,
  ]);

  const handleCloseDetails = useCallback(() => {
    setSelectedAdmissionId(null);
    setSelectedTracking(null);
    setDetailErrorCode(null);
  }, []);

  const handleSearchQueryChange = useCallback((value) => {
    const nextValue =
      typeof value === 'string' ? value : value?.target?.value ?? '';
    setSearchQuery(nextValue);
  }, []);

  const handleOpenAdmit = useCallback(() => {
    router.push('/admit');
  }, [router]);

  const handleUpdateTracking = useCallback(
    (row) => {
      const admissionId = row?.admissionId || row?.id || selectedAdmissionId;
      const path = admissionId
        ? `/abg-ventilator-updates?admissionId=${encodeURIComponent(admissionId)}`
        : '/abg-ventilator-updates';
      router.push(path);
    },
    [router, selectedAdmissionId]
  );

  const localDraft = useMemo(() => {
    if (!sessionId || (!inputs && !recommendationSummary)) return null;
    return {
      sessionId,
      hasInputs: Boolean(inputs),
      hasRecommendation: Boolean(recommendationSummary),
      hasMonitoring:
        Array.isArray(monitoringTimeSeries) && monitoringTimeSeries.length > 0,
      assessmentCurrentStep:
        typeof assessmentCurrentStep === 'number' ? assessmentCurrentStep : 0,
    };
  }, [
    assessmentCurrentStep,
    inputs,
    monitoringTimeSeries,
    recommendationSummary,
    sessionId,
  ]);

  const activeFacility = rows[0]
    ? {
        id: rows[0].facilityId,
        name: rows[0].facilityName,
      }
    : null;
  const filteredRows = useMemo(
    () => filterTrackingRows(rows, searchQuery),
    [rows, searchQuery]
  );
  const isSearchActive = searchQuery.trim().length > 0;

  return {
    list: filteredRows,
    rows: filteredRows,
    allRows: rows,
    activeFacility,
    isEmpty: rows.length === 0,
    isSearchActive,
    isSearchEmpty:
      rows.length > 0 && filteredRows.length === 0 && isSearchActive,
    searchQuery,
    totalRows: rows.length,
    visibleRows: filteredRows.length,
    isHistoryLoading: isTrackingLoading,
    historyErrorCode: trackingErrorCode,
    isCorrupt: false,
    localDraft,
    admittedAdmissionId,
    showAdmittedBanner,
    selectedAdmissionId,
    selectedTracking,
    isDetailLoading,
    detailErrorCode,
    handleRefresh,
    handleSearchQueryChange,
    handleOpenAdmit,
    handleUpdateTracking,
    handleViewDetails,
    handleCloseDetails,
  };
}
