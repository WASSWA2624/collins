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
  detectVentilationComplexCase,
  mergeVentilationRecommendationWithAi,
  rankVentilationSimilarCases,
} from './ventilation.rules';
import { augmentVentilationCaseApi } from './ventilation.api';
 
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

    const datasetOutput = assembleVentilationRecommendationFromMatches({ dataset, rankedMatches, input });

    // Step 10.8: Optional online AI augmentation (never required for core path). Fail-safe: always return local recommendation.
    const aiConfig = ai && typeof ai === 'object' ? ai : {};
    const useOnlineAi = aiConfig.useOnlineAi === true;
    const isOnline = aiConfig.isOnline === true;
    const flags = aiConfig.flags ?? null;

    if (!useOnlineAi) {
      return Object.freeze({
        ...datasetOutput,
        aiAugmentation: Object.freeze({
          provider: 'aiSdk',
          status: 'skipped',
          reasonCodes: Object.freeze(['VENTILATION_AI_SKIPPED_USER_CHOSE_LOCAL']),
        }),
      });
    }

    const complex = detectVentilationComplexCase({ input, datasetOutput, dataset });
    if (!complex.isComplexCase) {
      return Object.freeze({
        ...datasetOutput,
        aiAugmentation: Object.freeze({
          provider: 'aiSdk',
          status: 'skipped',
          reasonCodes: Object.freeze(['VENTILATION_AI_SKIPPED_NOT_COMPLEX']),
        }),
      });
    }

    const aiResult = await augmentVentilationCaseApi({
      caseInput: input,
      isOnline,
      flags: { ...flags, AI_AUGMENTATION_ENABLED: true },
    });

    if (!aiResult?.ok || !aiResult?.aiOutput) {
      return Object.freeze({
        ...datasetOutput,
        aiAugmentation: Object.freeze({
          provider: 'aiSdk',
          status: 'skipped',
          reasonCodes: Object.freeze([aiResult?.errorCode ?? 'VENTILATION_AI_SKIPPED']),
          complexCase: complex,
        }),
      });
    }

    const merged = mergeVentilationRecommendationWithAi(datasetOutput, aiResult.aiOutput);
    return Object.freeze({
      ...merged,
      aiAugmentation: Object.freeze({
        ...(merged.aiAugmentation ?? {}),
        status: 'applied',
        reasonCodes: Object.freeze([]),
        complexCase: complex,
      }),
    });
  });

export {
  loadVentilationDatasetUseCase,
  getVentilationDatasetMetaUseCase,
  getVentilationDatasetIntendedUseCase,
  getVentilationRecommendationUseCase,
};
