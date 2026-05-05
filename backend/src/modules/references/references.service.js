import { prisma } from '../../config/prisma.js';
import {
  decorateReferenceRulesForTraining,
  VERIFIED_REFERENCE_GOVERNANCE_STATUSES,
} from '../training-help/trainingHelp.service.js';

export const activeReferenceWhere = (now) => ({
  verificationStatus: 'VERIFIED',
  governanceStatus: { in: [...VERIFIED_REFERENCE_GOVERNANCE_STATUSES] },
  OR: [
    { activeFrom: null },
    { activeFrom: { lte: now } },
  ],
  AND: [{ OR: [{ activeTo: null }, { activeTo: { gte: now } }] }],
});

export const listActiveReferenceRules = async (now = new Date()) => {
  const candidates = await prisma.referenceRule.findMany({
    where: activeReferenceWhere(now),
    orderBy: [{ name: 'asc' }, { version: 'desc' }],
  });

  return decorateReferenceRulesForTraining(candidates, now);
};

export const getReferencePolicy = () => ({
  verifiedOnly: true,
  eligibleGovernanceStatuses: [...VERIFIED_REFERENCE_GOVERNANCE_STATUSES],
  requiredMetadata: [
    'clinicalCondition',
    'patientPathway',
    'population',
    'parameterName',
    'lowerBound',
    'upperBound',
    'unit',
    'sourceCitation',
    'version',
    'scope',
    'verificationStatus',
    'verifiedBy',
    'verifiedAt',
    'reviewNotes',
    'auditTrail',
  ],
  safetyStatement: 'Reference rules support clinical judgement only and do not create treatment orders.',
});
