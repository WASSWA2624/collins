import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { MEMBERSHIP_ROLES } from '../src/constants/roles.js';
import {
  DEVELOPMENT_REFERENCE_SEED_EMAIL,
  DEVELOPMENT_REFERENCE_SEED_USER_ID,
  buildSeedReferenceRuleRows,
} from '../src/modules/references/referenceSeed.js';
import {
  CLINICAL_SAFETY_ACKNOWLEDGEMENT,
  CLINICAL_SAFETY_STATEMENT_HASH,
  ONBOARDING_STEPS,
} from '../src/modules/onboarding/onboarding.constants.js';

const prisma = new PrismaClient();

const DEVELOPMENT_ADMIN_USER_ID = 'development-platform-admin-user';
const DEVELOPMENT_ADMIN_EMAIL = 'admin@admin.com';
const DEVELOPMENT_ADMIN_PASSWORD = 'Admin';
const DEVELOPMENT_ADMIN_FACILITY_ID = 'development-admin-facility';
const DEVELOPMENT_ADMIN_ONBOARDED_AT = new Date('2026-05-06T00:00:00.000Z');

const main = async () => {
  const adminPasswordHash = await bcrypt.hash(DEVELOPMENT_ADMIN_PASSWORD, 12);
  const adminUser = await prisma.user.upsert({
    where: { email: DEVELOPMENT_ADMIN_EMAIL },
    update: {
      name: 'Development Platform Admin',
      passwordHash: adminPasswordHash,
      status: 'ACTIVE',
    },
    create: {
      id: DEVELOPMENT_ADMIN_USER_ID,
      name: 'Development Platform Admin',
      email: DEVELOPMENT_ADMIN_EMAIL,
      passwordHash: adminPasswordHash,
      status: 'ACTIVE',
    },
  });

  const adminFacility = await prisma.facility.upsert({
    where: { id: DEVELOPMENT_ADMIN_FACILITY_ID },
    update: {
      registryCode: 'COLLINS-DEV-ADMIN',
      name: 'Collins Development Admin Facility',
      district: 'Development',
      region: 'Development',
      type: 'Development',
      ownership: 'Development',
      verificationStatus: 'VERIFIED',
    },
    create: {
      id: DEVELOPMENT_ADMIN_FACILITY_ID,
      registryCode: 'COLLINS-DEV-ADMIN',
      name: 'Collins Development Admin Facility',
      district: 'Development',
      region: 'Development',
      type: 'Development',
      ownership: 'Development',
      verificationStatus: 'VERIFIED',
    },
  });

  await prisma.facilityMembership.upsert({
    where: {
      userId_facilityId_role: {
        userId: adminUser.id,
        facilityId: adminFacility.id,
        role: MEMBERSHIP_ROLES.PLATFORM_ADMIN,
      },
    },
    update: {
      status: 'APPROVED',
      approvedByUserId: adminUser.id,
    },
    create: {
      userId: adminUser.id,
      facilityId: adminFacility.id,
      role: MEMBERSHIP_ROLES.PLATFORM_ADMIN,
      status: 'APPROVED',
      approvedByUserId: adminUser.id,
    },
  });

  await prisma.onboardingState.upsert({
    where: { userId: adminUser.id },
    update: {
      status: 'COMPLETED',
      currentStep: 'COMPLETED',
      completedStepsJson: ONBOARDING_STEPS,
      selectedFacilityId: adminFacility.id,
      requestedRole: MEMBERSHIP_ROLES.PLATFORM_ADMIN,
      clinicalSafetyAcknowledgedAt: DEVELOPMENT_ADMIN_ONBOARDED_AT,
      clinicalSafetyAcknowledgementVersion: CLINICAL_SAFETY_ACKNOWLEDGEMENT.version,
      clinicalSafetyStatementHash: CLINICAL_SAFETY_STATEMENT_HASH,
      completedAt: DEVELOPMENT_ADMIN_ONBOARDED_AT,
    },
    create: {
      userId: adminUser.id,
      status: 'COMPLETED',
      currentStep: 'COMPLETED',
      completedStepsJson: ONBOARDING_STEPS,
      selectedFacilityId: adminFacility.id,
      requestedRole: MEMBERSHIP_ROLES.PLATFORM_ADMIN,
      clinicalSafetyAcknowledgedAt: DEVELOPMENT_ADMIN_ONBOARDED_AT,
      clinicalSafetyAcknowledgementVersion: CLINICAL_SAFETY_ACKNOWLEDGEMENT.version,
      clinicalSafetyStatementHash: CLINICAL_SAFETY_STATEMENT_HASH,
      completedAt: DEVELOPMENT_ADMIN_ONBOARDED_AT,
    },
  });

  await prisma.userSettings.upsert({
    where: { userId: adminUser.id },
    update: {
      activeFacilityId: adminFacility.id,
    },
    create: {
      userId: adminUser.id,
      activeFacilityId: adminFacility.id,
    },
  });

  const passwordHash = await bcrypt.hash('disabled-development-reference-seed-user', 12);
  const seedUser = await prisma.user.upsert({
    where: { email: DEVELOPMENT_REFERENCE_SEED_EMAIL },
    update: {
      name: 'Development Reference Seed',
      status: 'DEACTIVATED',
    },
    create: {
      id: DEVELOPMENT_REFERENCE_SEED_USER_ID,
      name: 'Development Reference Seed',
      email: DEVELOPMENT_REFERENCE_SEED_EMAIL,
      passwordHash,
      status: 'DEACTIVATED',
    },
  });

  const rules = buildSeedReferenceRuleRows(undefined, { seedUserId: seedUser.id });
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

  console.log(`Seeded development admin user ${DEVELOPMENT_ADMIN_EMAIL}.`);
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
