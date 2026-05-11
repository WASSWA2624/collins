import bcrypt from 'bcryptjs';
import { readFileSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { MEMBERSHIP_ROLES } from '../src/constants/roles.js';
import { env } from '../src/config/env.js';
import {
  buildSeedReferenceRuleRows,
} from '../src/modules/references/referenceSeed.js';
import {
  CLINICAL_SAFETY_ACKNOWLEDGEMENT,
  CLINICAL_SAFETY_STATEMENT_HASH,
  ONBOARDING_STEPS,
} from '../src/modules/onboarding/onboarding.constants.js';
import {
  CORE_ADMIN_EMAIL,
  CORE_CLINICIAN_EMAIL,
  getCoreAdminFacility,
  seedUgandaFacilities,
} from './facilitySeed.mjs';

const adapter = new PrismaMariaDb(env.databaseUrl);
const prisma = new PrismaClient({ adapter });

const DEVELOPMENT_ADMIN_USER_ID = 'development-platform-admin-user';
const DEVELOPMENT_ADMIN_PASSWORD = 'Admin';
const DEVELOPMENT_ADMIN_ONBOARDED_AT = new Date('2026-05-06T00:00:00.000Z');
const DEVELOPMENT_CLINICIAN_USER_ID = 'development-clinician-user';
const DEVELOPMENT_CLINICIAN_PASSWORD = 'Clinician';
const RECOMMENDATION_SEED_SOURCE_TYPE = 'ventilation_recommendation_seed';
const RECOMMENDATION_SEED_REVIEWED_AT = new Date('2026-05-11T00:00:00.000Z');

const loadRecommendationSeedDataset = () =>
  JSON.parse(readFileSync(new URL('./data/ventilation-recommendation-seed.json', import.meta.url), 'utf8'));

const sourceMapFor = (dataset) =>
  Object.fromEntries((dataset.sources || []).map((source) => [source.id, source]));

const buildRecommendationSeedRows = ({ dataset, facilityId, adminUserId }) => {
  const sourcesById = sourceMapFor(dataset);

  return (dataset.cases || []).map((caseItem) => {
    const profile = caseItem.patientProfile || {};
    const clinical = caseItem.clinicalParameters || {};
    const settings = caseItem.ventilatorSettings || {};
    const sourceIds = caseItem.evidence?.sourceIds || [];
    const sources = sourceIds.map((sourceId) => sourcesById[sourceId]).filter(Boolean);
    const sexForSizeCalculations = profile.gender === 'female' ? 'FEMALE' : profile.gender === 'male' ? 'MALE' : 'UNKNOWN';
    const patientPathway = profile.patientPathway || 'UNKNOWN';
    const patient = {
      patientPathway,
      ageYears: profile.age,
      ageMonths: profile.ageMonths,
      ageDays: profile.ageDays,
      actualWeightKg: profile.weight,
      heightOrLengthCm: profile.height,
      sexForSizeCalculations,
    };
    const caseContext = {
      reasonForVentilation: profile.condition,
      primaryDiagnosis: profile.condition,
      severity: profile.severity,
      sourceCategory: caseItem.sourceCategory,
      sourceCaseId: caseItem.caseId,
    };
    const clinicalSnapshot = {
      spo2: clinical.spo2,
      respiratoryRate: clinical.respiratoryRate,
      heartRate: clinical.heartRate,
      mainCondition: profile.condition,
      comorbiditiesJson: {
        sourceCategory: caseItem.sourceCategory,
        comorbidities: profile.comorbidities || [],
      },
    };
    const abgTest = {
      ph: clinical.ph,
      pao2: clinical.pao2,
      paco2: clinical.paco2,
    };
    const ventilatorSetting = {
      mode: settings.mode,
      tidalVolumeMl: settings.tidalVolume,
      respiratoryRateSet: settings.respiratoryRate,
      peep: settings.peep,
      ieRatio: settings.ieRatio,
      pressureSupport: settings.pressureSupport,
      inspiratoryPressure: settings.inspiratoryPressure,
      peakPressure: settings.peakPressure,
      plateauPressure: settings.plateauPressure,
      source: RECOMMENDATION_SEED_SOURCE_TYPE,
    };
    const deidentifiedPayloadJson = {
      caseContext,
      patient,
      clinicalSnapshots: [clinicalSnapshot],
      abgTests: [abgTest],
      ventilatorSettings: [ventilatorSetting],
      recommendations: caseItem.recommendations,
      evidence: {
        ...caseItem.evidence,
        sources,
      },
      outcomes: caseItem.outcomes,
      review: caseItem.review,
    };

    return {
      facilityId,
      sourceType: RECOMMENDATION_SEED_SOURCE_TYPE,
      sourcePayloadJson: {
        seedCaseId: caseItem.caseId,
        syntheticSeed: true,
        containsPatientLevelSourceData: false,
      },
      structuredPreviewJson: {
        caseContext,
        patient,
        clinicalSnapshot,
        abgTest,
        ventilatorSetting,
        sourceCategory: caseItem.sourceCategory,
      },
      deidentifiedPayloadJson,
      deidentificationStatus: 'deidentified_synthetic_seed',
      reviewStatus: 'APPROVED_FOR_TRAINING',
      approvedForTraining: true,
      approvedByUserId: adminUserId,
      reviewedByUserId: adminUserId,
      reviewedAt: RECOMMENDATION_SEED_REVIEWED_AT,
      ethicsApprovalId: 'DEVELOPMENT_SYNTHETIC_REFERENCE_SEED',
      governanceJson: {
        syntheticSeed: true,
        noPatientLevelSourceData: true,
        approvedForRecommendationTraining: true,
        clinicianReviewRequired: true,
        sourceBacked: true,
        deidentified: true,
        sourceCategory: caseItem.sourceCategory,
        recommendationSource: {
          category: caseItem.sourceCategory,
          sourceIds,
          sources,
          notes: caseItem.evidence?.notes,
        },
        intendedUse: dataset.intendedUse,
        datasetVersion: dataset.datasetVersion,
      },
      datasetVersion: dataset.datasetVersion,
    };
  });
};

const chunkArray = (items, size) => {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

const seedVentilationRecommendationDataset = async ({ facilityId, adminUserId }) => {
  const dataset = loadRecommendationSeedDataset();
  const rows = buildRecommendationSeedRows({ dataset, facilityId, adminUserId });

  await prisma.datasetCase.deleteMany({
    where: {
      facilityId,
      sourceType: RECOMMENDATION_SEED_SOURCE_TYPE,
    },
  });

  for (const chunk of chunkArray(rows, 100)) {
    await prisma.datasetCase.createMany({ data: chunk });
  }

  return {
    datasetVersion: dataset.datasetVersion,
    totalCases: rows.length,
  };
};

const upsertDevelopmentUser = async ({
  id,
  name,
  email,
  password,
}) => {
  const passwordHash = await bcrypt.hash(password, 12);
  return prisma.user.upsert({
    where: { email },
    update: {
      name,
      status: 'ACTIVE',
    },
    create: {
      id,
      name,
      email,
      passwordHash,
      status: 'ACTIVE',
    },
  });
};

const approveFacilityMembership = ({ userId, facilityId, role, approvedByUserId }) => prisma.facilityMembership.upsert({
  where: {
    userId_facilityId_role: {
      userId,
      facilityId,
      role,
    },
  },
  update: {
    status: 'APPROVED',
    approvedByUserId,
  },
  create: {
    userId,
    facilityId,
    role,
    status: 'APPROVED',
    approvedByUserId,
  },
});

const completeOnboarding = ({ userId, facilityId, requestedRole }) => prisma.onboardingState.upsert({
  where: { userId },
  update: {
    status: 'COMPLETED',
    currentStep: 'COMPLETED',
    completedStepsJson: ONBOARDING_STEPS,
    selectedFacilityId: facilityId,
    requestedRole,
    clinicalSafetyAcknowledgedAt: DEVELOPMENT_ADMIN_ONBOARDED_AT,
    clinicalSafetyAcknowledgementVersion: CLINICAL_SAFETY_ACKNOWLEDGEMENT.version,
    clinicalSafetyStatementHash: CLINICAL_SAFETY_STATEMENT_HASH,
    completedAt: DEVELOPMENT_ADMIN_ONBOARDED_AT,
  },
  create: {
    userId,
    status: 'COMPLETED',
    currentStep: 'COMPLETED',
    completedStepsJson: ONBOARDING_STEPS,
    selectedFacilityId: facilityId,
    requestedRole,
    clinicalSafetyAcknowledgedAt: DEVELOPMENT_ADMIN_ONBOARDED_AT,
    clinicalSafetyAcknowledgementVersion: CLINICAL_SAFETY_ACKNOWLEDGEMENT.version,
    clinicalSafetyStatementHash: CLINICAL_SAFETY_STATEMENT_HASH,
    completedAt: DEVELOPMENT_ADMIN_ONBOARDED_AT,
  },
});

const setActiveFacility = ({ userId, facilityId }) => prisma.userSettings.upsert({
  where: { userId },
  update: {
    activeFacilityId: facilityId,
  },
  create: {
    userId,
    activeFacilityId: facilityId,
  },
});

const main = async () => {
  const facilitySeedSummary = await seedUgandaFacilities(prisma);
  const adminFacility = await getCoreAdminFacility(prisma);
  if (!adminFacility) {
    throw new Error('Core admin facility was not seeded.');
  }

  const adminUser = await upsertDevelopmentUser({
    id: DEVELOPMENT_ADMIN_USER_ID,
    name: 'Platform Admin',
    email: CORE_ADMIN_EMAIL,
    password: DEVELOPMENT_ADMIN_PASSWORD,
  });

  await approveFacilityMembership({
    userId: adminUser.id,
    facilityId: adminFacility.id,
    role: MEMBERSHIP_ROLES.PLATFORM_ADMIN,
    approvedByUserId: adminUser.id,
  });

  await completeOnboarding({
    userId: adminUser.id,
    facilityId: adminFacility.id,
    requestedRole: MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  });

  await setActiveFacility({
    userId: adminUser.id,
    facilityId: adminFacility.id,
  });

  const clinicianUser = await upsertDevelopmentUser({
    id: DEVELOPMENT_CLINICIAN_USER_ID,
    name: 'Clinician User',
    email: CORE_CLINICIAN_EMAIL,
    password: DEVELOPMENT_CLINICIAN_PASSWORD,
  });

  await approveFacilityMembership({
    userId: clinicianUser.id,
    facilityId: adminFacility.id,
    role: MEMBERSHIP_ROLES.CLINICIAN,
    approvedByUserId: adminUser.id,
  });

  await completeOnboarding({
    userId: clinicianUser.id,
    facilityId: adminFacility.id,
    requestedRole: MEMBERSHIP_ROLES.CLINICIAN,
  });

  await setActiveFacility({
    userId: clinicianUser.id,
    facilityId: adminFacility.id,
  });

  const rules = buildSeedReferenceRuleRows(undefined, { seedUserId: adminUser.id });
  for (const rule of rules) {
    await prisma.referenceRule.upsert({
      where: {
        name_version: {
          name: rule.name,
          version: rule.version,
        },
      },
      update: rule,
      create: rule,
    });
  }
  const recommendationSeedSummary = await seedVentilationRecommendationDataset({
    facilityId: adminFacility.id,
    adminUserId: adminUser.id,
  });

  console.log(`Seeded ${facilitySeedSummary.total} Uganda facilities (${facilitySeedSummary.created} created, ${facilitySeedSummary.updated} updated).`);
  console.log(`Seeded core admin user ${CORE_ADMIN_EMAIL}.`);
  console.log(`Seeded core clinician user ${CORE_CLINICIAN_EMAIL}.`);
  console.log(`Seeded ${rules.length} verified development reference rules.`);
  console.log(`Seeded ${recommendationSeedSummary.totalCases} ventilation recommendation dataset cases (${recommendationSeedSummary.datasetVersion}).`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
