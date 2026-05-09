import bcrypt from 'bcryptjs';
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

  console.log(`Seeded ${facilitySeedSummary.total} Uganda facilities (${facilitySeedSummary.created} created, ${facilitySeedSummary.updated} updated).`);
  console.log(`Seeded core admin user ${CORE_ADMIN_EMAIL}.`);
  console.log(`Seeded core clinician user ${CORE_CLINICIAN_EMAIL}.`);
  console.log(`Seeded ${rules.length} verified development reference rules.`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
