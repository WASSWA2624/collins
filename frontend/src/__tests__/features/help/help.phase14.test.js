const {
  GUIDE_KEYS,
  filterGlossaryKeys,
  filterGuideKeys,
  filterTroubleshootingKeys,
} = require('@features/help/help.rules');

describe('phase 14 help search', () => {
  it('covers workflow guide keys', () => {
    expect(GUIDE_KEYS).toEqual(expect.arrayContaining([
      'home',
      'newPatient',
      'tracking',
      'abgVentUpdate',
      'datasetCapture',
      'reviewQueue',
      'dashboard',
      'settings',
    ]));
  });

  it('finds spaced workflow names and safety topics', () => {
    expect(filterGuideKeys('review queue')).toContain('reviewQueue');
    expect(filterGuideKeys('ABG vent update')).toContain('abgVentUpdate');
    expect(filterGlossaryKeys('verified reference')).toContain('referenceStatus');
    expect(filterTroubleshootingKeys('model readiness')).toContain('roleRestrictedModelHelp');
  });
});
