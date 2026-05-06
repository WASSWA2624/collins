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
const DEVELOPMENT_CLINICIAN_USER_ID = 'development-clinician-user';
const DEVELOPMENT_CLINICIAN_EMAIL = 'clinician@clinician.com';
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
      passwordHash,
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
  const adminUser = await upsertDevelopmentUser({
    id: DEVELOPMENT_ADMIN_USER_ID,
    name: 'Development Platform Admin',
    email: DEVELOPMENT_ADMIN_EMAIL,
    password: DEVELOPMENT_ADMIN_PASSWORD,
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
    name: 'Development Clinician',
    email: DEVELOPMENT_CLINICIAN_EMAIL,
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
  console.log(`Seeded development clinician user ${DEVELOPMENT_CLINICIAN_EMAIL}.`);
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
