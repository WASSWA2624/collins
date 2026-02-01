/**
 * useCaseDetailScreen
 * Shared logic for Case detail screen: resolve case by id, citations, review, intended use.
 */
import { useMemo } from 'react';
import {
  getDefaultVentilationDataset,
  getVentilationCaseById,
  getVentilationCaseCitations,
  getVentilationCaseReviewStatus,
  getVentilationDatasetIntendedUse,
} from '@features/ventilation/ventilation.model';

export default function useCaseDetailScreen(caseId) {
  const dataset = getDefaultVentilationDataset();
  const caseItem = useMemo(
    () => getVentilationCaseById(caseId, dataset),
    [caseId, dataset]
  );
  const citations = useMemo(
    () => (caseItem ? getVentilationCaseCitations(caseItem, dataset) : []),
    [caseItem, dataset]
  );
  const reviewStatus = useMemo(
    () => (caseItem ? getVentilationCaseReviewStatus(caseItem) : null),
    [caseItem]
  );
  const intendedUse = useMemo(
    () => getVentilationDatasetIntendedUse(dataset),
    [dataset]
  );

  const missingCaseId =
    caseId == null || (typeof caseId === 'string' && caseId.trim() === '');
  const notFound = !missingCaseId && !caseItem;

  return {
    caseItem,
    citations,
    reviewStatus,
    intendedUse,
    missingCaseId,
    notFound,
  };
}
