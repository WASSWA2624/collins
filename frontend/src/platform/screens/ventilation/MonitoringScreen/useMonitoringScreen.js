/**
 * useMonitoringScreen
 * Shared logic for Monitoring screen: time-series entry, trends, alerts.
 */
import { useCallback, useMemo } from 'react';
import useVentilationSession from '@hooks/useVentilationSession';
import useNetwork from '@hooks/useNetwork';
import {
  addTimeSeriesPoint,
  classifyAlertSeverity,
  computeSimpleTrend,
} from '@features/ventilation';

const DEFAULT_THRESHOLDS = {
  SpO2: { warningLow: 92, criticalLow: 88 },
  RR: { warningHigh: 28, criticalHigh: 35 },
  HR: { warningHigh: 120, criticalHigh: 150, warningLow: 50, criticalLow: 40 },
};

function getSuggestedActionKey(severity) {
  switch (severity) {
    case 'critical':
      return 'suggestedActionCritical';
    case 'warning':
      return 'suggestedActionWarning';
    case 'unknown':
      return 'suggestedActionUnknown';
    default:
      return 'suggestedActionNormal';
  }
}

function getWhyKey(severity, value, thresholds) {
  if (severity === 'normal' || severity === 'unknown') return null;
  const v = Number(value);
  if (Number.isFinite(v) && thresholds) {
    if (thresholds.criticalLow != null && v < thresholds.criticalLow) return 'whyCriticalLow';
    if (thresholds.warningLow != null && v < thresholds.warningLow) return 'whyWarningLow';
    if (thresholds.criticalHigh != null && v > thresholds.criticalHigh) return 'whyCriticalHigh';
    if (thresholds.warningHigh != null && v > thresholds.warningHigh) return 'whyWarningHigh';
  }
  return 'why';
}

export default function useMonitoringScreen() {
  const { recommendationSummary, monitoringTimeSeries, setMonitoringTimeSeries, isHydrating, errorCode } = useVentilationSession();
  const { isOffline } = useNetwork();

  const timeSeriesList = Array.isArray(monitoringTimeSeries) ? monitoringTimeSeries : [];

  const monitoringPointNames = useMemo(
    () => recommendationSummary?.monitoringPoints ?? [],
    [recommendationSummary]
  );

  const addPoint = useCallback(
    (name, unit, value) => {
      const trimmedName = typeof name === 'string' ? name.trim() : '';
      const trimmedUnit = typeof unit === 'string' ? unit.trim() || '—' : '—';
      const trimmedValue = typeof value === 'string' ? value.trim() : String(value ?? '');
      if (!trimmedName || !trimmedValue) return;

      const point = { timestamp: new Date().toISOString(), value: trimmedValue };
      const prev = timeSeriesList;

      try {
        const existing = prev.find((s) => s.name === trimmedName);
        const nextList = existing
          ? prev.map((s) =>
              s.name === trimmedName
                ? addTimeSeriesPoint(
                    { name: s.name, unit: s.unit, points: s.points ?? [] },
                    point
                  )
                : s
            )
          : [...prev, { name: trimmedName, unit: trimmedUnit, points: [point] }];
        setMonitoringTimeSeries(nextList);
      } catch {
        // keep prev on error
      }
    },
    [timeSeriesList, setMonitoringTimeSeries]
  );

  const trends = useMemo(
    () =>
      timeSeriesList.map((s) => ({
        name: s.name,
        unit: s.unit,
        ...computeSimpleTrend(s.points),
      })),
    [timeSeriesList]
  );

  const alerts = useMemo(() => {
    const list = [];
    timeSeriesList.forEach((s) => {
      const points = s.points;
      if (points.length === 0) return;
      const last = points[points.length - 1];
      const thresholds = DEFAULT_THRESHOLDS[s.name] ?? null;
      const severity = classifyAlertSeverity({ value: last.value, thresholds });
      list.push({
        id: `${s.name}-${last.timestamp}`,
        seriesName: s.name,
        value: last.value,
        unit: s.unit,
        severity,
        whyKey: getWhyKey(severity, last.value, thresholds),
        suggestedActionKey: getSuggestedActionKey(severity),
      });
    });
    return list;
  }, [timeSeriesList]);

  const pointsForHistory = useMemo(() => {
    const out = [];
    timeSeriesList.forEach((s) => {
      s.points.forEach((p, i) => {
        out.push({
          id: `${s.name}-${p.timestamp}-${i}`,
          seriesName: s.name,
          unit: s.unit,
          ...p,
        });
      });
    });
    out.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    return out;
  }, [timeSeriesList]);

  return {
    timeSeriesList,
    monitoringPointNames,
    addPoint,
    trends,
    alerts,
    pointsForHistory,
    isHydrating,
    errorCode,
    isOffline,
  };
}
