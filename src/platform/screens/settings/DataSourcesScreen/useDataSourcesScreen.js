/**
 * useDataSourcesScreen
 * Shared logic: dataset meta + sources from ventilation model.
 */
import { useMemo } from 'react';
import {
  getDefaultVentilationDataset,
  getVentilationDatasetMeta,
  getVentilationDatasetSources,
} from '@features/ventilation/ventilation.model';
import { DATA_SOURCES_TEST_IDS } from './types';

export default function useDataSourcesScreen() {
  const dataset = getDefaultVentilationDataset();
  const meta = useMemo(() => getVentilationDatasetMeta(dataset), [dataset]);
  const sources = useMemo(() => getVentilationDatasetSources(dataset) ?? [], [dataset]);
  const hasSources = Array.isArray(sources) && sources.length > 0;

  return useMemo(
    () => ({
      testIds: DATA_SOURCES_TEST_IDS,
      meta,
      sources,
      hasSources,
    }),
    [meta, sources, hasSources]
  );
}
