/**
 * Ventilation Monitoring Model
 * Time series helpers + explainable trend + alert classification.
 * File: ventilation.monitoring.model.js
 */
import { z } from 'zod';

// Compatible with dataset.schema.observationModel.timeSeriesShape
const timeSeriesPointSchema = z
  .object({
    timestamp: z.string().min(1),
    value: z.string().min(1),
  })
  .passthrough();

const timeSeriesSchema = z
  .object({
    name: z.string().min(1),
    unit: z.string().min(1),
    points: z.array(timeSeriesPointSchema).min(1),
  })
  .passthrough();

const safeNumber = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

const sortPointsByTimestamp = (points) => {
  const list = Array.isArray(points) ? points.slice() : [];
  const keyFor = (ts) => {
    const parsed = Date.parse(ts);
    if (Number.isFinite(parsed)) return parsed;
    return ts;
  };

  return list.sort((a, b) => {
    const ka = keyFor(a?.timestamp ?? '');
    const kb = keyFor(b?.timestamp ?? '');
    if (typeof ka === 'number' && typeof kb === 'number') return ka - kb;
    return String(ka).localeCompare(String(kb));
  });
};

const addTimeSeriesPoint = (series, point) => {
  const parsedSeries = timeSeriesSchema.safeParse(series);
  const parsedPoint = timeSeriesPointSchema.safeParse(point);
  if (!parsedSeries.success) throw new Error('timeSeries_invalid');
  if (!parsedPoint.success) throw new Error('timeSeries_point_invalid');

  const nextPoints = sortPointsByTimestamp([...parsedSeries.data.points, parsedPoint.data]);
  return Object.freeze({
    ...parsedSeries.data,
    points: Object.freeze([...nextPoints]),
  });
};

const computeSimpleTrend = (points, { minPoints = 2, deltaThreshold = 0 } = {}) => {
  const list = sortPointsByTimestamp(Array.isArray(points) ? points : []);
  const required = Number.isInteger(minPoints) && minPoints > 0 ? minPoints : 2;
  if (list.length < required) {
    return Object.freeze({ direction: 'insufficient-data', delta: null, start: null, end: null });
  }

  const first = list[0];
  const last = list[list.length - 1];
  const start = safeNumber(first?.value);
  const end = safeNumber(last?.value);
  if (start === null || end === null) {
    return Object.freeze({ direction: 'unknown', delta: null, start, end });
  }

  const delta = end - start;
  const threshold = typeof deltaThreshold === 'number' && Number.isFinite(deltaThreshold) ? Math.abs(deltaThreshold) : 0;
  const absDelta = Math.abs(delta);

  if (absDelta <= threshold) return Object.freeze({ direction: 'flat', delta, start, end });
  return Object.freeze({ direction: delta > 0 ? 'up' : 'down', delta, start, end });
};

const ALERT_SEVERITY = Object.freeze({
  NORMAL: 'normal',
  WARNING: 'warning',
  CRITICAL: 'critical',
  UNKNOWN: 'unknown',
});

const classifyAlertSeverity = ({ value, thresholds }) => {
  const v = safeNumber(value);
  if (v === null) return ALERT_SEVERITY.UNKNOWN;

  const t = thresholds && typeof thresholds === 'object' ? thresholds : {};
  const criticalLow = safeNumber(t.criticalLow);
  const warningLow = safeNumber(t.warningLow);
  const warningHigh = safeNumber(t.warningHigh);
  const criticalHigh = safeNumber(t.criticalHigh);

  if (criticalLow !== null && v < criticalLow) return ALERT_SEVERITY.CRITICAL;
  if (warningLow !== null && v < warningLow) return ALERT_SEVERITY.WARNING;
  if (criticalHigh !== null && v > criticalHigh) return ALERT_SEVERITY.CRITICAL;
  if (warningHigh !== null && v > warningHigh) return ALERT_SEVERITY.WARNING;

  return ALERT_SEVERITY.NORMAL;
};

export {
  timeSeriesPointSchema,
  timeSeriesSchema,
  addTimeSeriesPoint,
  computeSimpleTrend,
  ALERT_SEVERITY,
  classifyAlertSeverity,
};

