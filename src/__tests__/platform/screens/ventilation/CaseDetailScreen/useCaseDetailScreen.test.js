/**
 * useCaseDetailScreen Tests (P011 11.S.6)
 * Tests: param parsing, missing caseId, not-found-in-dataset path
 */
const { renderHook } = require('@testing-library/react-native');
const useCaseDetailScreen = require('@platform/screens/ventilation/CaseDetailScreen/useCaseDetailScreen').default;

describe('useCaseDetailScreen', () => {
  it('returns missingCaseId true when caseId is null or empty', () => {
    const { result: r1 } = renderHook(() => useCaseDetailScreen(null));
    expect(r1.current.missingCaseId).toBe(true);
    expect(r1.current.caseItem).toBeNull();
    expect(r1.current.notFound).toBe(false);

    const { result: r2 } = renderHook(() => useCaseDetailScreen(undefined));
    expect(r2.current.missingCaseId).toBe(true);

    const { result: r3 } = renderHook(() => useCaseDetailScreen(''));
    expect(r3.current.missingCaseId).toBe(true);

    const { result: r4 } = renderHook(() => useCaseDetailScreen('   '));
    expect(r4.current.missingCaseId).toBe(true);
  });

  it('returns notFound true when caseId is not in dataset (not-found-in-dataset path)', () => {
    const { result } = renderHook(() => useCaseDetailScreen('NON_EXISTENT_CASE_ID'));
    expect(result.current.missingCaseId).toBe(false);
    expect(result.current.notFound).toBe(true);
    expect(result.current.caseItem).toBeNull();
  });

  it('returns caseItem, citations, reviewStatus when caseId exists in dataset', () => {
    const { result } = renderHook(() => useCaseDetailScreen('CASE_001'));
    expect(result.current.missingCaseId).toBe(false);
    expect(result.current.notFound).toBe(false);
    expect(result.current.caseItem).not.toBeNull();
    expect(result.current.caseItem.caseId).toBe('CASE_001');
    expect(Array.isArray(result.current.citations)).toBe(true);
    expect(typeof result.current.reviewStatus).toBe('string');
    expect(result.current.intendedUse).toEqual(
      expect.objectContaining({ warning: expect.any(String) })
    );
  });
});
