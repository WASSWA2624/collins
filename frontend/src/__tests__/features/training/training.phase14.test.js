const {
  TRAINING_WORKFLOWS,
  buildTrainingDocuments,
  findForbiddenTrainingWording,
  getDefaultTrainingContent,
  searchTrainingContent,
} = require('@features/training');

describe('phase 14 training catalog', () => {
  it('covers required workflows with versioned reference policy metadata', () => {
    const content = getDefaultTrainingContent();

    expect([...content.workflows]).toEqual([...TRAINING_WORKFLOWS]);
    expect(content.contentVersion).toBe('2026.05.phase14');
    expect(content.referencePolicy.verifiedOnly).toBe(true);
    expect([...content.referencePolicy.requiredMetadata]).toEqual([
      'verificationStatus',
      'sourceCitation',
      'version',
      'scope',
    ]);
  });

  it('keeps advisory copy free of forbidden order-like wording', () => {
    expect(findForbiddenTrainingWording(getDefaultTrainingContent())).toEqual([]);
  });

  it('filters predictive model readiness content away from clinical roles', () => {
    const content = getDefaultTrainingContent();
    const clinicalDocs = buildTrainingDocuments(content, { roles: ['clinician'] });
    const platformDocs = buildTrainingDocuments(content, { roles: ['platform_admin'] });

    expect(clinicalDocs.some((doc) => doc.id === 'governance.model-readiness')).toBe(false);
    expect(platformDocs.some((doc) => doc.id === 'governance.model-readiness')).toBe(true);
  });

  it('keeps model-readiness search role restricted', () => {
    const content = getDefaultTrainingContent();

    const clinicalResults = searchTrainingContent({ content, query: 'model readiness', roles: ['clinician'] });
    expect(clinicalResults.some((result) => result.id === 'governance.model-readiness')).toBe(false);
    expect(clinicalResults.some((result) => result.id === 'faq.models')).toBe(false);
    expect(clinicalResults.some((result) => result.id === 'Shadow mode')).toBe(false);
    expect(
      searchTrainingContent({ content, query: 'model readiness', roles: ['platform_admin'] })
        .some((result) => result.id === 'governance.model-readiness')
    ).toBe(true);
  });
});
