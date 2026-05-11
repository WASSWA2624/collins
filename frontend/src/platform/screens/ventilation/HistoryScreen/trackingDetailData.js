/**
 * Shared tracking detail display helpers
 * File: trackingDetailData.js
 */

const hasValue = (value) =>
  value !== null && value !== undefined && String(value).trim() !== '';

const formatUnitValue = (value, unit) => {
  if (!hasValue(value)) return '';
  const numeric = Number(value);
  return Number.isFinite(numeric) ? `${numeric.toLocaleString()} ${unit}` : '';
};

const getPatientLabel = (row, t) =>
  row?.optionalName ||
  row?.appAdmissionCode ||
  row?.appPatientCode ||
  t('ventilation.tracking.patient.unknown');

const getDisplayValue = (value, t) =>
  hasValue(value)
    ? String(value)
    : t('ventilation.tracking.patientData.notRecorded');

const getTrackingPatientDataRows = (row, t) => {
  if (!row) return [];

  return [
    {
      key: 'patient-id',
      label: t('ventilation.tracking.patientData.patientId'),
      value: getDisplayValue(row.patientId, t),
    },
    {
      key: 'patient-code',
      label: t('ventilation.tracking.patientData.patientCode'),
      value: getDisplayValue(row.appPatientCode, t),
    },
    {
      key: 'admission-id',
      label: t('ventilation.tracking.patientData.admissionId'),
      value: getDisplayValue(row.admissionId, t),
    },
    {
      key: 'admission-code',
      label: t('ventilation.tracking.patientData.admissionCode'),
      value: getDisplayValue(row.appAdmissionCode, t),
    },
    {
      key: 'hospital-number',
      label: t('ventilation.tracking.patientData.hospitalNumber'),
      value: getDisplayValue(row.hospitalNumber, t),
    },
    {
      key: 'facility',
      label: t('ventilation.tracking.patientData.facility'),
      value: getDisplayValue(row.facilityName, t),
    },
    {
      key: 'age-group',
      label: t('ventilation.tracking.patientData.ageGroup'),
      value: getDisplayValue(row.patientPathwayLabel, t),
    },
    {
      key: 'age',
      label: t('ventilation.tracking.patientData.age'),
      value: getDisplayValue(row.ageLabel, t),
    },
    {
      key: 'date-of-birth',
      label: t('ventilation.tracking.patientData.dateOfBirth'),
      value: getDisplayValue(row.dateOfBirthLabel, t),
    },
    {
      key: 'weight',
      label: t('ventilation.tracking.patientData.weight'),
      value: getDisplayValue(formatUnitValue(row.actualWeightKg, 'kg'), t),
    },
    {
      key: 'reference-weight',
      label: t('ventilation.tracking.patientData.referenceWeight'),
      value: getDisplayValue(formatUnitValue(row.referenceWeightKg, 'kg'), t),
    },
    {
      key: 'height',
      label: t('ventilation.tracking.patientData.height'),
      value: getDisplayValue(formatUnitValue(row.heightOrLengthCm, 'cm'), t),
    },
  ];
};

export { getPatientLabel, getTrackingPatientDataRows };
