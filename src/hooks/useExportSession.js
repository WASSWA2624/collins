/**
 * useExportSession
 * Export session summary to text (platform-appropriate download).
 */
import { useCallback } from 'react';
import { getDefaultVentilationDataset, getVentilationDatasetIntendedUse } from '@features/ventilation';
import { buildSessionSummaryText } from '@utils/sessionExport';
import { trackEvent } from '@services/analytics';

const isWeb = typeof document !== 'undefined' && typeof document.createElement === 'function';

const triggerDownload = (filename, text) => {
  if (!isWeb) return;
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default function useExportSession({ recommendationSummary, inputs, sessionId } = {}) {
  const exportSummary = useCallback(
    (anonymize = false) => {
      const dataset = getDefaultVentilationDataset();
      const intendedUse = getVentilationDatasetIntendedUse(dataset);
      const text = buildSessionSummaryText({
        summary: recommendationSummary,
        inputs: inputs ?? null,
        intendedUse,
        sessionId: sessionId ?? null,
        anonymize,
      });
      const name = anonymize ? 'session-summary-anonymized.txt' : 'session-summary.txt';
      triggerDownload(name, text);
      trackEvent('export_summary', { anonymize });
    },
    [recommendationSummary, inputs, sessionId]
  );

  return { exportSummary };
}
