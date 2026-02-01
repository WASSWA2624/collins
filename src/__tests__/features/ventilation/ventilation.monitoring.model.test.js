/**
 * Ventilation Monitoring Model Tests
 * File: ventilation.monitoring.model.test.js
 */
import {
  ALERT_SEVERITY,
  addTimeSeriesPoint,
  classifyAlertSeverity,
  computeSimpleTrend,
  timeSeriesSchema,
} from '@features/ventilation';

describe('ventilation.monitoring.model', () => {
  describe('timeSeriesSchema', () => {
    it('accepts dataset-compatible shape', () => {
      const parsed = timeSeriesSchema.safeParse({
        name: 'SpO2',
        unit: '%',
        points: [{ timestamp: '2026-01-01T00:00:00Z', value: '92' }],
      });
      expect(parsed.success).toBe(true);
    });
  });

  describe('addTimeSeriesPoint', () => {
    it('adds and sorts out-of-order timestamps', () => {
      const series = {
        name: 'RR',
        unit: 'breaths/min',
        points: [
          { timestamp: '2026-01-02T00:00:00Z', value: '20' },
          { timestamp: '2026-01-03T00:00:00Z', value: '22' },
        ],
      };

      const next = addTimeSeriesPoint(series, { timestamp: '2026-01-01T00:00:00Z', value: '18' });
      expect(next.points.map((p) => p.timestamp)).toEqual([
        '2026-01-01T00:00:00Z',
        '2026-01-02T00:00:00Z',
        '2026-01-03T00:00:00Z',
      ]);
    });

    it('throws on invalid series or point', () => {
      expect(() => addTimeSeriesPoint(null, { timestamp: 'x', value: '1' })).toThrow('timeSeries_invalid');
      expect(() =>
        addTimeSeriesPoint({ name: 'x', unit: 'y', points: [{ timestamp: 't', value: '1' }] }, { timestamp: '', value: '' })
      ).toThrow('timeSeries_point_invalid');
    });
  });

  describe('computeSimpleTrend', () => {
    it('returns insufficient-data for sparse points', () => {
      const trend = computeSimpleTrend([{ timestamp: 't1', value: '1' }]);
      expect(trend.direction).toBe('insufficient-data');
      expect(trend.delta).toBeNull();
    });

    it('returns unknown when values are not numeric', () => {
      const trend = computeSimpleTrend([
        { timestamp: 't1', value: 'x' },
        { timestamp: 't2', value: 'y' },
      ]);
      expect(trend.direction).toBe('unknown');
      expect(trend.delta).toBeNull();
    });

    it('detects flat with threshold', () => {
      const trend = computeSimpleTrend(
        [
          { timestamp: '2026-01-01T00:00:00Z', value: '10' },
          { timestamp: '2026-01-02T00:00:00Z', value: '11' },
        ],
        { deltaThreshold: 2 }
      );
      expect(trend.direction).toBe('flat');
      expect(trend.delta).toBe(1);
    });

    it('detects up/down and handles out-of-order timestamps', () => {
      const up = computeSimpleTrend(
        [
          { timestamp: '2026-01-02T00:00:00Z', value: '10' },
          { timestamp: '2026-01-01T00:00:00Z', value: '8' },
        ],
        { deltaThreshold: 0 }
      );
      expect(up.direction).toBe('up');
      expect(up.delta).toBe(2);

      const down = computeSimpleTrend(
        [
          { timestamp: '2026-01-02T00:00:00Z', value: '8' },
          { timestamp: '2026-01-01T00:00:00Z', value: '10' },
        ],
        { deltaThreshold: 0 }
      );
      expect(down.direction).toBe('down');
      expect(down.delta).toBe(-2);
    });

    it('sanitizes invalid minPoints to default', () => {
      const trend = computeSimpleTrend(
        [
          { timestamp: 't1', value: '1' },
          { timestamp: 't2', value: '2' },
        ],
        { minPoints: 0 }
      );
      expect(trend.direction).toBe('up');
    });
  });

  describe('classifyAlertSeverity', () => {
    it('returns unknown for non-numeric values', () => {
      expect(classifyAlertSeverity({ value: 'x', thresholds: {} })).toBe(ALERT_SEVERITY.UNKNOWN);
    });

    it('classifies low-side thresholds', () => {
      const thresholds = { criticalLow: 7.0, warningLow: 7.2 };
      expect(classifyAlertSeverity({ value: 6.9, thresholds })).toBe(ALERT_SEVERITY.CRITICAL);
      expect(classifyAlertSeverity({ value: 7.1, thresholds })).toBe(ALERT_SEVERITY.WARNING);
      expect(classifyAlertSeverity({ value: 7.3, thresholds })).toBe(ALERT_SEVERITY.NORMAL);
    });

    it('classifies high-side thresholds', () => {
      const thresholds = { warningHigh: 100, criticalHigh: 110 };
      expect(classifyAlertSeverity({ value: 111, thresholds })).toBe(ALERT_SEVERITY.CRITICAL);
      expect(classifyAlertSeverity({ value: 101, thresholds })).toBe(ALERT_SEVERITY.WARNING);
      expect(classifyAlertSeverity({ value: 99, thresholds })).toBe(ALERT_SEVERITY.NORMAL);
    });

    it('handles missing/invalid thresholds object', () => {
      expect(classifyAlertSeverity({ value: 10, thresholds: null })).toBe(ALERT_SEVERITY.NORMAL);
      expect(classifyAlertSeverity({ value: 10, thresholds: { warningHigh: 'nope' } })).toBe(ALERT_SEVERITY.NORMAL);
    });
  });
});

