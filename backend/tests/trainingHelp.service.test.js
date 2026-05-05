import test from 'node:test';
import assert from 'node:assert/strict';
import { MEMBERSHIP_ROLES } from '../src/constants/roles.js';
import {
  decorateReferenceRulesForTraining,
  explainReferenceRuleForTraining,
  filterDecisionSupportReferenceRules,
  findForbiddenTrainingWording,
  getTrainingHelpCatalog,
} from '../src/modules/training-help/trainingHelp.service.js';

test('training help catalog covers required workflows without unsafe order-like wording', () => {
  const catalog = getTrainingHelpCatalog({ roles: [MEMBERSHIP_ROLES.PLATFORM_ADMIN] });

  assert.deepEqual(catalog.workflows, [
    'home',
    'admit',
    'tracking',
    'abg-vent-update',
    'dataset-capture',
    'review-queue',
    'dashboard',
    'settings',
  ]);
  assert.equal(catalog.referencePolicy.verifiedOnly, true);
  assert.equal(catalog.dataBoundary.includes('separate from live facility records'), true);
  assert.deepEqual(findForbiddenTrainingWording(catalog), []);
});

test('training help filters model-governance content away from normal clinical roles', () => {
  const clinicianCatalog = getTrainingHelpCatalog({ roles: [MEMBERSHIP_ROLES.CLINICIAN] });
  const platformCatalog = getTrainingHelpCatalog({ roles: [MEMBERSHIP_ROLES.PLATFORM_ADMIN] });

  assert.equal(clinicianCatalog.topics.some((topic) => topic.id === 'governance.model-readiness'), false);
  assert.equal(platformCatalog.topics.some((topic) => topic.id === 'governance.model-readiness'), true);
});

test('training reference helpers only expose active verified rules as decision-support eligible', () => {
  const now = new Date('2026-05-05T12:00:00.000Z');
  const rules = [
    {
      id: 'approved-global',
      name: 'Oxygenation range',
      version: '1.0',
      sourceCitation: 'Local ICU reference committee v1',
      verificationStatus: 'verified',
      governanceStatus: 'approved',
      ruleJson: { parameter: 'pao2' },
      activeFrom: new Date('2026-01-01T00:00:00.000Z'),
      activeTo: null,
    },
    {
      id: 'draft-global',
      name: 'Draft ventilation range',
      version: '0.1',
      sourceCitation: 'Draft only',
      verificationStatus: 'draft',
      governanceStatus: 'draft',
      ruleJson: { parameter: 'peep' },
      activeFrom: new Date('2026-01-01T00:00:00.000Z'),
      activeTo: null,
    },
    {
      id: 'future-global',
      name: 'Future range',
      version: '2.0',
      sourceCitation: 'Future source',
      verificationStatus: 'verified',
      governanceStatus: 'verified',
      ruleJson: { parameter: 'fio2' },
      activeFrom: new Date('2027-01-01T00:00:00.000Z'),
      activeTo: null,
    },
    {
      id: 'expired-global',
      name: 'Expired range',
      version: '0.9',
      sourceCitation: 'Retired source',
      verificationStatus: 'verified',
      governanceStatus: 'approved',
      ruleJson: { parameter: 'ph' },
      activeFrom: new Date('2025-01-01T00:00:00.000Z'),
      activeTo: new Date('2025-12-31T00:00:00.000Z'),
    },
  ];

  const activeRules = filterDecisionSupportReferenceRules(rules, now);
  assert.deepEqual(activeRules.map((rule) => rule.id), ['approved-global']);

  const decorated = decorateReferenceRulesForTraining(rules, now);
  assert.equal(decorated.length, 1);
  assert.equal(decorated[0].referenceUse.decisionSupportEligible, true);
  assert.equal(decorated[0].referenceUse.scope.type, 'global');
  assert.equal(decorated[0].referenceUse.version, '1.0');
  assert.equal(decorated[0].referenceUse.sourceCitation, 'Local ICU reference committee v1');

  const draftExplanation = explainReferenceRuleForTraining(rules[1], now);
  assert.equal(draftExplanation.decisionSupportEligible, false);
  assert.equal(draftExplanation.verificationStatus, 'draft');
});
