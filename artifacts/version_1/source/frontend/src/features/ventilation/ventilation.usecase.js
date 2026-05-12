/**
 * Ventilation Use Cases
 * File: ventilation.usecase.js
 */
import { handleError } from '@errors';
import {
  buildVentilationCaseIndex,
  getDefaultVentilationDataset,
  getVentilationCandidateCases,
  getVentilationDatasetIntendedUse,
  getVentilationDatasetMeta,
  parseVentilationDataset,
} from './ventilation.model';
import {
  assembleVentilationRecommendationFromMatches,
  rankVentilationSimilarCases,
} from './ventilation.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const loadVentilationDatasetUseCase = async (rawDataset) =>
  execute(async () => {
    if (rawDataset !== undefined) {
      return parseVentilationDataset(rawDataset);
    }
    return getDefaultVentilationDataset();
  });

const getVentilationDatasetMetaUseCase = async () =>
  execute(async () => getVentilationDatasetMeta(getDefaultVentilationDataset()));

const getVentilationDatasetIntendedUseCase = async () =>
  execute(async () => getVentilationDatasetIntendedUse(getDefaultVentilationDataset()));

const getVentilationRecommendationUseCase = async ({ input, topN, rawDataset, ai } = {}) =>
  execute(async () => {
    const dataset = rawDataset !== undefined ? parseVentilationDataset(rawDataset) : getDefaultVentilationDataset();
    const index = buildVentilationCaseIndex(dataset);
    const candidateCases = getVentilationCandidateCases({ dataset, index, condition: input?.condition });

    const rankedMatches = rankVentilationSimilarCases({
      input,
      candidateCases,
      topN,
    });

    const aiConfig = ai && typeof ai === 'object' ? ai : {};
    const datasetOutput = assembleVentilationRecommendationFromMatches({
      dataset,
      rankedMatches,
      input,
      includeModelInternals: aiConfig.includeModelInternals === true,
      backendSummary: aiConfig.backendSummary ?? null,
    });

    return Object.freeze({
      ...datasetOutput,
      aiAugmentation: Object.freeze({
        provider: 'aiSdk',
        status: 'disabled_by_governance',
        reasonCodes: Object.freeze(['VENTILATION_AI_DISABLED_BY_GOVERNANCE']),
      }),
    });
  });

export {
  loadVentilationDatasetUseCase,
  getVentilationDatasetMetaUseCase,
  getVentilationDatasetIntendedUseCase,
  getVentilationRecommendationUseCase,
};
