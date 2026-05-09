import { mkdir, writeFile } from 'node:fs/promises';
import { prisma } from '../src/config/prisma.js';
import { MEMBERSHIP_ROLES } from '../src/constants/roles.js';
import {
  CORE_ADMIN_EMAIL,
  CORE_CLINICIAN_EMAIL,
  getCoreAdminFacility,
  seedUgandaFacilities,
} from '../prisma/facilitySeed.mjs';

const args = new Set(process.argv.slice(2));
const dryRun = !args.has('--apply');
const keepOnlyCoreUsers = args.has('--keep-only-core-users');

const DUMMY_FACILITY_PATTERN = /\b(codex|test|demo|dummy|development)\b|coin development|collins development/i;
const DUMMY_USER_PATTERN = /\b(codex|test|demo|dummy|development)\b|recovered deactivated/i;
const CORE_EMAILS = new Set([CORE_ADMIN_EMAIL, CORE_CLINICIAN_EMAIL]);

const isDummyFacility = (facility) =>
  DUMMY_FACILITY_PATTERN.test([
    facility.name,
    facility.registryCode,
    facility.district,
    facility.region,
    facility.type,
    facility.ownership,
  ].filter(Boolean).join(' '));

const isDummyUser = (user) => {
  const email = String(user.email || '').toLowerCase();
  if (CORE_EMAILS.has(email)) return false;
  if (email.endsWith('@collins.local')) return true;
  if (email.startsWith('codex-') || email.includes('+test@')) return true;
  return DUMMY_USER_PATTERN.test([user.name, user.email].filter(Boolean).join(' '));
};

const whereIdIn = (ids) => ({ id: { in: ids } });
const optionalIn = (field, ids) => (ids.length ? { [field]: { in: ids } } : { id: { in: [] } });

const findUsersToDelete = (users) => users.filter((user) =>
  isDummyUser(user) || (keepOnlyCoreUsers && !CORE_EMAILS.has(String(user.email || '').toLowerCase())));

const collectBackup = async ({ dummyFacilityIds, dummyUserIds }) => {
  const admissions = dummyFacilityIds.length
    ? await prisma.admission.findMany({ where: { facilityId: { in: dummyFacilityIds } } })
    : [];
  const admissionIds = admissions.map((admission) => admission.id);

  return {
    createdAt: new Date().toISOString(),
    dryRun,
    keepOnlyCoreUsers,
    dummyFacilityIds,
    dummyUserIds,
    facilities: await prisma.facility.findMany({ where: whereIdIn(dummyFacilityIds) }),
    users: await prisma.user.findMany({ where: whereIdIn(dummyUserIds) }),
    facilityMemberships: await prisma.facilityMembership.findMany({
      where: {
        OR: [
          optionalIn('facilityId', dummyFacilityIds),
          optionalIn('userId', dummyUserIds),
          optionalIn('approvedByUserId', dummyUserIds),
        ],
      },
    }),
    userSettings: await prisma.userSettings.findMany({
      where: {
        OR: [
          optionalIn('userId', dummyUserIds),
          optionalIn('activeFacilityId', dummyFacilityIds),
        ],
      },
    }),
    onboardingStates: await prisma.onboardingState.findMany({
      where: {
        OR: [
          optionalIn('userId', dummyUserIds),
          optionalIn('selectedFacilityId', dummyFacilityIds),
        ],
      },
    }),
    refreshSessions: await prisma.refreshSession.findMany({ where: optionalIn('userId', dummyUserIds) }),
    facilitySettings: await prisma.facilitySettings.findMany({ where: optionalIn('facilityId', dummyFacilityIds) }),
    patients: await prisma.patient.findMany({ where: optionalIn('facilityId', dummyFacilityIds) }),
    admissions,
    clinicalSnapshots: await prisma.clinicalSnapshot.findMany({ where: optionalIn('admissionId', admissionIds) }),
    abgTests: await prisma.abgTest.findMany({ where: optionalIn('admissionId', admissionIds) }),
    ventilatorSettings: await prisma.ventilatorSetting.findMany({ where: optionalIn('admissionId', admissionIds) }),
    airwayDevices: await prisma.airwayDevice.findMany({ where: optionalIn('admissionId', admissionIds) }),
    humidificationDecisions: await prisma.humidificationDecision.findMany({ where: optionalIn('admissionId', admissionIds) }),
    dailyVentilationReviews: await prisma.dailyVentilationReview.findMany({ where: optionalIn('admissionId', admissionIds) }),
    outcomes: await prisma.outcome.findMany({ where: optionalIn('admissionId', admissionIds) }),
    datasetCases: await prisma.datasetCase.findMany({
      where: { OR: [optionalIn('facilityId', dummyFacilityIds), optionalIn('sourceAdmissionId', admissionIds)] },
    }),
    modelOutputs: await prisma.modelOutput.findMany({
      where: { OR: [optionalIn('facilityId', dummyFacilityIds), optionalIn('sourceAdmissionId', admissionIds)] },
    }),
    referenceRules: await prisma.referenceRule.findMany({
      where: {
        OR: [
          optionalIn('facilityId', dummyFacilityIds),
          optionalIn('approvedByUserId', dummyUserIds),
          optionalIn('verifiedByUserId', dummyUserIds),
        ],
      },
    }),
    reviewActions: await prisma.reviewAction.findMany({
      where: { OR: [optionalIn('facilityId', dummyFacilityIds), optionalIn('reviewerUserId', dummyUserIds)] },
    }),
    idempotencyRecords: await prisma.idempotencyRecord.findMany({
      where: { OR: [optionalIn('facilityId', dummyFacilityIds), optionalIn('userId', dummyUserIds)] },
    }),
    syncEvents: await prisma.syncEvent.findMany({
      where: { OR: [optionalIn('facilityId', dummyFacilityIds), optionalIn('userId', dummyUserIds)] },
    }),
    auditLogs: await prisma.auditLog.findMany({
      where: { OR: [optionalIn('facilityId', dummyFacilityIds), optionalIn('userId', dummyUserIds)] },
    }),
  };
};

const writeBackup = async (backup) => {
  const backupDir = new URL('../tmp/cleanup-backups/', import.meta.url);
  await mkdir(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupUrl = new URL(`facility-cleanup-${stamp}.json`, backupDir);
  await writeFile(backupUrl, `${JSON.stringify(backup, null, 2)}\n`);
  return backupUrl;
};

const ensureCoreMemberships = async (tx, coreFacility, adminUser, clinicianUser) => {
  if (!coreFacility || !adminUser) return;

  await tx.user.update({
    where: { id: adminUser.id },
    data: { name: 'Platform Admin', status: 'ACTIVE' },
  });
  await tx.facilityMembership.upsert({
    where: {
      userId_facilityId_role: {
        userId: adminUser.id,
        facilityId: coreFacility.id,
        role: MEMBERSHIP_ROLES.PLATFORM_ADMIN,
      },
    },
    update: { status: 'APPROVED', approvedByUserId: adminUser.id },
    create: {
      userId: adminUser.id,
      facilityId: coreFacility.id,
      role: MEMBERSHIP_ROLES.PLATFORM_ADMIN,
      status: 'APPROVED',
      approvedByUserId: adminUser.id,
    },
  });
  await tx.userSettings.upsert({
    where: { userId: adminUser.id },
    update: { activeFacilityId: coreFacility.id },
    create: { userId: adminUser.id, activeFacilityId: coreFacility.id },
  });
  await tx.onboardingState.updateMany({
    where: { userId: adminUser.id },
    data: {
      selectedFacilityId: coreFacility.id,
      requestedRole: MEMBERSHIP_ROLES.PLATFORM_ADMIN,
    },
  });

  if (!clinicianUser) return;
  await tx.user.update({
    where: { id: clinicianUser.id },
    data: { name: 'Clinician User', status: 'ACTIVE' },
  });
  await tx.facilityMembership.upsert({
    where: {
      userId_facilityId_role: {
        userId: clinicianUser.id,
        facilityId: coreFacility.id,
        role: MEMBERSHIP_ROLES.CLINICIAN,
      },
    },
    update: { status: 'APPROVED', approvedByUserId: adminUser.id },
    create: {
      userId: clinicianUser.id,
      facilityId: coreFacility.id,
      role: MEMBERSHIP_ROLES.CLINICIAN,
      status: 'APPROVED',
      approvedByUserId: adminUser.id,
    },
  });
  await tx.userSettings.upsert({
    where: { userId: clinicianUser.id },
    update: { activeFacilityId: coreFacility.id },
    create: { userId: clinicianUser.id, activeFacilityId: coreFacility.id },
  });
  await tx.onboardingState.updateMany({
    where: { userId: clinicianUser.id },
    data: {
      selectedFacilityId: coreFacility.id,
      requestedRole: MEMBERSHIP_ROLES.CLINICIAN,
    },
  });
};

const applyCleanup = async ({ dummyFacilityIds, dummyUserIds, coreFacility, adminUser, clinicianUser }) => {
  await prisma.$transaction(async (tx) => {
    await ensureCoreMemberships(tx, coreFacility, adminUser, clinicianUser);

    const admissions = dummyFacilityIds.length
      ? await tx.admission.findMany({
        where: { facilityId: { in: dummyFacilityIds } },
        select: { id: true },
      })
      : [];
    const admissionIds = admissions.map((admission) => admission.id);

    const nullableUserFields = [
      ['facilityMembership', 'approvedByUserId'],
      ['admission', 'createdByUserId'],
      ['clinicalSnapshot', 'enteredByUserId'],
      ['abgTest', 'enteredByUserId'],
      ['abgTest', 'reviewedByUserId'],
      ['ventilatorSetting', 'enteredByUserId'],
      ['airwayDevice', 'enteredByUserId'],
      ['humidificationDecision', 'confirmedByUserId'],
      ['dailyVentilationReview', 'reviewerUserId'],
      ['outcome', 'enteredByUserId'],
      ['datasetCase', 'approvedByUserId'],
      ['datasetCase', 'reviewedByUserId'],
      ['referenceRule', 'approvedByUserId'],
      ['referenceRule', 'verifiedByUserId'],
      ['reviewAction', 'reviewerUserId'],
      ['idempotencyRecord', 'userId'],
      ['syncEvent', 'userId'],
      ['auditLog', 'userId'],
    ];

    for (const [model, field] of nullableUserFields) {
      await tx[model].updateMany({
        where: optionalIn(field, dummyUserIds),
        data: { [field]: null },
      });
    }

    await tx.modelOutput.deleteMany({
      where: { OR: [optionalIn('facilityId', dummyFacilityIds), optionalIn('sourceAdmissionId', admissionIds)] },
    });
    await tx.datasetCase.deleteMany({
      where: { OR: [optionalIn('facilityId', dummyFacilityIds), optionalIn('sourceAdmissionId', admissionIds)] },
    });
    await tx.outcome.deleteMany({ where: optionalIn('admissionId', admissionIds) });
    await tx.dailyVentilationReview.deleteMany({ where: optionalIn('admissionId', admissionIds) });
    await tx.humidificationDecision.deleteMany({ where: optionalIn('admissionId', admissionIds) });
    await tx.airwayDevice.deleteMany({ where: optionalIn('admissionId', admissionIds) });
    await tx.ventilatorSetting.deleteMany({ where: optionalIn('admissionId', admissionIds) });
    await tx.abgTest.deleteMany({ where: optionalIn('admissionId', admissionIds) });
    await tx.clinicalSnapshot.deleteMany({ where: optionalIn('admissionId', admissionIds) });
    await tx.admission.deleteMany({ where: whereIdIn(admissionIds) });
    await tx.patient.deleteMany({ where: optionalIn('facilityId', dummyFacilityIds) });

    await tx.referenceRule.deleteMany({ where: optionalIn('facilityId', dummyFacilityIds) });
    await tx.reviewAction.updateMany({ where: optionalIn('facilityId', dummyFacilityIds), data: { facilityId: null } });
    await tx.idempotencyRecord.updateMany({ where: optionalIn('facilityId', dummyFacilityIds), data: { facilityId: null } });
    await tx.syncEvent.updateMany({ where: optionalIn('facilityId', dummyFacilityIds), data: { facilityId: null } });
    await tx.auditLog.updateMany({ where: optionalIn('facilityId', dummyFacilityIds), data: { facilityId: null } });

    await tx.userSettings.updateMany({
      where: {
        activeFacilityId: { in: dummyFacilityIds },
        userId: { notIn: [adminUser?.id, clinicianUser?.id].filter(Boolean) },
      },
      data: { activeFacilityId: null },
    });
    await tx.onboardingState.updateMany({
      where: {
        selectedFacilityId: { in: dummyFacilityIds },
        userId: { notIn: [adminUser?.id, clinicianUser?.id].filter(Boolean) },
      },
      data: { selectedFacilityId: null, requestedRole: null },
    });

    await tx.facilityMembership.deleteMany({
      where: {
        OR: [
          optionalIn('facilityId', dummyFacilityIds),
          optionalIn('userId', dummyUserIds),
        ],
      },
    });
    await tx.refreshSession.deleteMany({ where: optionalIn('userId', dummyUserIds) });
    await tx.userSettings.deleteMany({ where: optionalIn('userId', dummyUserIds) });
    await tx.onboardingState.deleteMany({ where: optionalIn('userId', dummyUserIds) });
    await tx.facilitySettings.deleteMany({ where: optionalIn('facilityId', dummyFacilityIds) });
    await tx.facility.deleteMany({ where: whereIdIn(dummyFacilityIds) });
    await tx.user.deleteMany({ where: whereIdIn(dummyUserIds) });
  }, { timeout: 30000 });
};

const main = async () => {
  const seedSummary = await seedUgandaFacilities(prisma);
  const [facilities, users, coreFacility] = await Promise.all([
    prisma.facility.findMany(),
    prisma.user.findMany(),
    getCoreAdminFacility(prisma),
  ]);
  const usersToDelete = findUsersToDelete(users);
  const dummyFacilities = facilities.filter(isDummyFacility);
  const adminUser = users.find((user) => String(user.email || '').toLowerCase() === CORE_ADMIN_EMAIL);
  const clinicianUser = users.find((user) => String(user.email || '').toLowerCase() === CORE_CLINICIAN_EMAIL);
  const dummyFacilityIds = dummyFacilities.map((facility) => facility.id);
  const dummyUserIds = usersToDelete.map((user) => user.id);
  const preservedUsers = users
    .filter((user) => !dummyUserIds.includes(user.id))
    .map((user) => user.email);

  const backup = await collectBackup({ dummyFacilityIds, dummyUserIds });
  const backupUrl = await writeBackup(backup);

  if (!dryRun) {
    await applyCleanup({ dummyFacilityIds, dummyUserIds, coreFacility, adminUser, clinicianUser });
  }

  console.log(JSON.stringify({
    mode: dryRun ? 'dry-run' : 'applied',
    backup: backupUrl.pathname,
    seededFacilities: seedSummary,
    removedFacilities: dummyFacilities.map((facility) => facility.name),
    removedUsers: usersToDelete.map((user) => user.email),
    preservedUsers,
    keepOnlyCoreUsers,
  }, null, 2));
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
