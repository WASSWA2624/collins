import { prisma } from '../../config/prisma.js';

const admissionInclude = {
  patient: true,
  facility: true,
  clinicalSnapshots: { orderBy: { measuredAt: 'desc' }, take: 1 },
  abgTests: { orderBy: { collectedAt: 'desc' }, take: 1 },
  ventilatorSettings: { orderBy: { measuredAt: 'desc' }, take: 1 },
  airwayDevices: { orderBy: { measuredAt: 'desc' }, take: 1 },
  humidificationDecisions: { orderBy: { measuredAt: 'desc' }, take: 1 },
  dailyReviews: { orderBy: { reviewDate: 'desc' }, take: 1 },
};

const createPatientCode = () => `COL-${Date.now().toString(36).toUpperCase()}`;

export const listAdmissions = async ({ facilityId, status, page, limit }) => {
  const where = {
    ...(facilityId ? { facilityId } : {}),
    ...(status ? { status } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.admission.findMany({
      where,
      include: admissionInclude,
      orderBy: { admittedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.admission.count({ where }),
  ]);

  return { items, total, page, limit };
};

export const createAdmission = ({ facilityId, bedNumber, admittedAt, admissionSource, reasonForVentilation, patient }, createdByUserId) => {
  const appPatientCode = patient.appPatientCode || createPatientCode();

  return prisma.$transaction(async (tx) => {
    const createdPatient = await tx.patient.create({
      data: {
        ...patient,
        appPatientCode,
        facilityId,
      },
    });

    return tx.admission.create({
      data: {
        patientId: createdPatient.id,
        facilityId,
        bedNumber,
        admittedAt,
        admissionSource,
        reasonForVentilation,
        createdByUserId,
      },
      include: admissionInclude,
    });
  });
};

export const getAdmissionById = async (id) => {
  const admission = await prisma.admission.findUnique({ where: { id }, include: admissionInclude });
  if (!admission) {
    const error = new Error('Admission not found');
    error.status = 404;
    throw error;
  }
  return admission;
};

export const updateAdmission = (id, data) => prisma.admission.update({
  where: { id },
  data,
  include: admissionInclude,
});

export const addClinicalSnapshot = (admissionId, data, enteredByUserId) => prisma.clinicalSnapshot.create({
  data: { admissionId, ...data, enteredByUserId },
});

export const addAbgTest = async (admissionId, data, enteredByUserId) => {
  const latest = await prisma.abgTest.findFirst({
    where: { admissionId },
    orderBy: { version: 'desc' },
    select: { version: true },
  });

  return prisma.abgTest.create({
    data: {
      admissionId,
      ...data,
      version: (latest?.version || 0) + 1,
      enteredByUserId,
    },
  });
};

export const addVentilatorSetting = (admissionId, data, enteredByUserId) => prisma.ventilatorSetting.create({
  data: { admissionId, ...data, enteredByUserId },
});

export const addAirwayDevice = (admissionId, data, enteredByUserId) => prisma.airwayDevice.create({
  data: { admissionId, ...data, enteredByUserId },
});

export const addHumidification = (admissionId, data, confirmedByUserId) => prisma.humidificationDecision.create({
  data: { admissionId, ...data, confirmedByUserId },
});

export const addDailyReview = (admissionId, data, reviewedByUserId) => prisma.dailyVentilationReview.create({
  data: { admissionId, ...data, reviewedByUserId },
});

export const addOutcome = (admissionId, data, enteredByUserId) => prisma.outcome.create({
  data: { admissionId, ...data, enteredByUserId },
});
