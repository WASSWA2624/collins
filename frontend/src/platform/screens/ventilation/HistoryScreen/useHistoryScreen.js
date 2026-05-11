/**
 * useHistoryScreen
 * Shared logic for Tracking screen.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVentilationSession } from '@hooks';
import useAuth from '@hooks/useAuth';
import { getFacilityOptionsForUser } from '@config/accessControl';
import { searchFacilitiesUseCase } from '@features/facilities';
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

const getSearchParamValue = (value) => {
  if (Array.isArray(value)) return value[0] || '';
  return typeof value === 'string' ? value : '';
};

const isEnabledParam = (value) => ['1', 'true', 'yes'].includes(getSearchParamValue(value).toLowerCase());

const normalizeText = (value) => String(value || '').trim().toLowerCase();

const normalizeFacilityOption = (facility) => {
  if (!facility || typeof facility !== 'object') return null;
  const nested = facility.facility && typeof facility.facility === 'object'
    ? facility.facility
    : {};
  const id = facility.id || facility.facilityId || nested.id || nested.facilityId;
  const name = facility.name || facility.facilityName || nested.name || id;
  if (!id) return null;
  return {
    id,
    name,
    registryCode: facility.registryCode || nested.registryCode,
    district: facility.district || nested.district,
    region: facility.region || nested.region,
    ownership: facility.ownership || nested.ownership,
    type: facility.type || nested.type,
  };
};

const uniqueFacilities = (...groups) => {
  const byId = new Map();
  groups.flat().forEach((facility) => {
    const normalized = normalizeFacilityOption(facility);
    if (normalized?.id && !byId.has(normalized.id)) {
      byId.set(normalized.id, normalized);
    }
  });
  return [...byId.values()];
};

const facilityMatchesQuery = (facility, query) => {
  const token = normalizeText(query);
  if (!token) return true;
  return [
    facility.name,
    facility.registryCode,
    facility.district,
    facility.region,
    facility.ownership,
    facility.type,
  ].some((value) => normalizeText(value).includes(token));
};

export default function useHistoryScreen(options = {}) {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const detailMode = options.detailMode === true || isEnabledParam(searchParams?.detail);
  const {
    user,
    activeFacility: authActiveFacility,
    activeFacilityId,
  } = useAuth();
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
  const [facilityQuery, setFacilityQuery] = useState(null);
  const [selectedFacilityOverrideId, setSelectedFacilityOverrideId] = useState(null);
  const [availableFacilities, setAvailableFacilities] = useState([]);
  const [isFacilitiesLoading, setIsFacilitiesLoading] = useState(false);
  const [facilitiesErrorCode, setFacilitiesErrorCode] = useState(null);

  const membershipFacilityOptions = useMemo(
    () => getFacilityOptionsForUser(user),
    [user]
  );

  const activeFacilityOption = useMemo(
    () => normalizeFacilityOption(authActiveFacility),
    [authActiveFacility]
  );

  const facilityOptions = useMemo(
    () =>
      uniqueFacilities(
        availableFacilities,
        membershipFacilityOptions,
        activeFacilityOption
      ),
    [activeFacilityOption, availableFacilities, membershipFacilityOptions]
  );

  const selectedFacility = useMemo(() => {
    const selectedId =
      selectedFacilityOverrideId || activeFacilityId || activeFacilityOption?.id || null;
    return (
      facilityOptions.find((facility) => facility.id === selectedId) ||
      activeFacilityOption ||
      facilityOptions[0] ||
      null
    );
  }, [activeFacilityId, activeFacilityOption, facilityOptions, selectedFacilityOverrideId]);

  const selectedFacilityId = selectedFacility?.id || activeFacilityId || null;

  const facilitySelectOptions = useMemo(
    () =>
      uniqueFacilities(selectedFacility, facilityOptions).filter((facility) =>
        facilityMatchesQuery(facility, facilityQuery ?? '')
      ),
    [facilityOptions, facilityQuery, selectedFacility]
  );

  const displayedFacilityQuery = facilityQuery ?? selectedFacility?.name ?? '';

  const loadFacilities = useCallback(async () => {
    setIsFacilitiesLoading(true);
    setFacilitiesErrorCode(null);
    try {
      const result = await searchFacilitiesUseCase({ limit: 500 });
      setAvailableFacilities(result?.facilities ?? []);
    } catch (error) {
      setAvailableFacilities([]);
      setFacilitiesErrorCode(normalizeErrorCode(error, 'FACILITIES_LOAD_FAILED'));
    } finally {
      setIsFacilitiesLoading(false);
    }
  }, []);

  const admittedAdmissionId = useMemo(() => {
    return getSearchParamValue(searchParams?.admissionId);
  }, [searchParams?.admissionId]);

  const showAdmittedBanner = useMemo(() => {
    return isEnabledParam(searchParams?.admitted) && Boolean(admittedAdmissionId);
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
    router.push(`/tracking/${encodeURIComponent(admissionId)}?detail=1`);
  }, [router]);

  const loadTracking = useCallback(async () => {
    if (detailMode && admittedAdmissionId) {
      setRows([]);
      setTrackingErrorCode(null);
      setIsTrackingLoading(false);
      return;
    }

    setIsTrackingLoading(true);
    setTrackingErrorCode(null);
    try {
      const params = {
        status: 'ACTIVE',
        limit: 100,
      };
      if (selectedFacilityId) params.facilityId = selectedFacilityId;
      const result = await listTrackingAdmissionsUseCase({
        ...params,
      });
      setRows(result?.items ?? []);
    } catch (error) {
      setRows([]);
      setTrackingErrorCode(normalizeErrorCode(error));
    } finally {
      setIsTrackingLoading(false);
    }
  }, [admittedAdmissionId, detailMode, selectedFacilityId]);

  useEffect(() => {
    loadFacilities();
  }, [loadFacilities]);

  useEffect(() => {
    loadTracking();
  }, [loadTracking]);

  const activeDetailAdmissionId =
    selectedAdmissionId || (detailMode ? admittedAdmissionId : null);

  const handleRefresh = useCallback(async () => {
    await loadTracking();
    if (activeDetailAdmissionId) {
      await loadTrackingDetail(activeDetailAdmissionId);
    }
  }, [activeDetailAdmissionId, loadTracking, loadTrackingDetail]);

  useEffect(() => {
    if (
      !detailMode ||
      !admittedAdmissionId ||
      autoOpenedAdmissionId === admittedAdmissionId ||
      selectedAdmissionId === admittedAdmissionId
    ) {
      return;
    }

    setAutoOpenedAdmissionId(admittedAdmissionId);
    setSelectedAdmissionId(admittedAdmissionId);
    loadTrackingDetail(admittedAdmissionId);
  }, [
    admittedAdmissionId,
    autoOpenedAdmissionId,
    detailMode,
    loadTrackingDetail,
    selectedAdmissionId,
  ]);

  useEffect(() => {
    if (
      detailMode ||
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
    detailMode,
    handleViewDetails,
    isTrackingLoading,
    rows,
    selectedAdmissionId,
  ]);

  const handleCloseDetails = useCallback(() => {
    if (detailMode) {
      if (typeof router.replace === 'function') router.replace('/tracking');
      else router.push('/tracking');
      return;
    }
    setSelectedAdmissionId(null);
    setSelectedTracking(null);
    setDetailErrorCode(null);
  }, [detailMode, router]);

  const handleSearchQueryChange = useCallback((value) => {
    const nextValue =
      typeof value === 'string' ? value : value?.target?.value ?? '';
    setSearchQuery(nextValue);
  }, []);

  const handleFacilityQueryChange = useCallback((value) => {
    setFacilityQuery(String(value ?? ''));
  }, []);

  const handleFacilityClear = useCallback(() => {
    setFacilityQuery('');
  }, []);

  const handleFacilityChange = useCallback(
    (facility) => {
      const normalized = normalizeFacilityOption(facility);
      if (!normalized?.id) return;
      setFacilityQuery(null);
      setSelectedAdmissionId(null);
      setSelectedTracking(null);
      setDetailErrorCode(null);
      setSelectedFacilityOverrideId(normalized.id);
    },
    []
  );

  const handleOpenAdmit = useCallback(() => {
    router.push('/new-patient');
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

  const handlePrintDetails = useCallback(() => {
    if (typeof window !== 'undefined' && typeof window.print === 'function') {
      window.print();
    }
  }, []);

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

  const detailRow = selectedTracking?.row || null;
  const activeFacility = detailRow
    ? {
        id: detailRow.facilityId,
        name: detailRow.facilityName,
      }
    : selectedFacility;
  const filteredRows = useMemo(
    () => filterTrackingRows(rows, searchQuery),
    [rows, searchQuery]
  );
  const isSearchActive = searchQuery.trim().length > 0;
  const visibleRowCount = detailMode
    ? selectedTracking?.row
      ? 1
      : 0
    : filteredRows.length;
  const isDetailLoadingEffective =
    isDetailLoading ||
    (detailMode && Boolean(admittedAdmissionId) && !selectedTracking && !detailErrorCode);

  return {
    list: filteredRows,
    rows: filteredRows,
    allRows: rows,
    activeFacility,
    isEmpty: !detailMode && rows.length === 0,
    isDetailMode: detailMode,
    isSearchActive,
    isSearchEmpty:
      rows.length > 0 && filteredRows.length === 0 && isSearchActive,
    searchQuery,
    facilitySearch: {
      query: displayedFacilityQuery,
      onQueryChange: handleFacilityQueryChange,
      value: selectedFacility,
      onValueChange: handleFacilityChange,
      onClear: handleFacilityClear,
      options: facilitySelectOptions,
      loading: isFacilitiesLoading,
      error: facilitiesErrorCode,
    },
    totalRows: rows.length,
    visibleRows: visibleRowCount,
    isHistoryLoading: isTrackingLoading,
    historyErrorCode: trackingErrorCode,
    isCorrupt: false,
    localDraft,
    admittedAdmissionId,
    showAdmittedBanner,
    selectedAdmissionId: activeDetailAdmissionId,
    selectedTracking,
    isDetailLoading: isDetailLoadingEffective,
    detailErrorCode,
    handleRefresh,
    handleSearchQueryChange,
    handleOpenAdmit,
    handleUpdateTracking,
    handleViewDetails,
    handleCloseDetails,
    handlePrintDetails,
  };
}
