/**
 * useHistoryScreen
 * Shared logic for History screen.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import useVentilationSession from '@hooks/useVentilationSession';

const CONFIDENCE_TIER_KEYS = { high: 'high', medium: 'medium', low: 'low' };

function formatSessionRow(entry) {
  const dateTime =
    typeof entry?.updatedAt === 'number' && Number.isFinite(entry.updatedAt)
      ? new Date(entry.updatedAt).toLocaleString(undefined, {
          dateStyle: 'short',
          timeStyle: 'short',
        })
      : '';
  const condition =
    typeof entry?.inputs?.condition === 'string'
      ? entry.inputs.condition.trim()
      : entry?.inputs?.patientProfile?.condition ?? '';
  const tier =
    entry?.recommendationSummary?.source?.confidenceTier ?? 'low';
  const tierKey = CONFIDENCE_TIER_KEYS[tier] ?? 'low';
  return { dateTime, condition, tierKey };
}

export default function useHistoryScreen() {
  const {
    sessionHistory,
    historyErrorCode,
    isHistoryLoading,
    loadHistory,
    deleteFromHistory,
    loadHistoryEntryIntoSession,
  } = useVentilationSession();

  const [sessionIdToDelete, setSessionIdToDelete] = useState(null);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleResume = useCallback(
    (entry) => {
      loadHistoryEntryIntoSession(entry);
    },
    [loadHistoryEntryIntoSession]
  );

  const handleDeleteRequest = useCallback((sessionId) => {
    setSessionIdToDelete(sessionId);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (sessionIdToDelete) {
      deleteFromHistory(sessionIdToDelete);
      setSessionIdToDelete(null);
    }
  }, [sessionIdToDelete, deleteFromHistory]);

  const handleDeleteCancel = useCallback(() => {
    setSessionIdToDelete(null);
  }, []);

  const list = Array.isArray(sessionHistory) ? sessionHistory : [];
  const isEmpty = list.length === 0;
  const isCorrupt = historyErrorCode === 'VENTILATION_SESSION_HISTORY_CORRUPT';

  const rows = useMemo(
    () => list.map((entry) => ({ entry, ...formatSessionRow(entry) })),
    [list]
  );

  return {
    list,
    rows,
    isEmpty,
    isHistoryLoading,
    historyErrorCode,
    isCorrupt,
    sessionIdToDelete,
    handleResume,
    handleDeleteRequest,
    handleDeleteConfirm,
    handleDeleteCancel,
  };
}
