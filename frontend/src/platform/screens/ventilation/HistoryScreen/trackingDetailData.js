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

const formatWeeks = (value) => formatUnitValue(value, 'weeks');

const getPatientLabel = (row, t) =>
  row?.optionalName ||
  row?.appAdmissionCode ||
  row?.appPatientCode ||
  t('ventilation.tracking.patient.unknown');

const getDisplayValue = (value, t) =>
  hasValue(value)
    ? String(value)
    : t('ventilation.tracking.patientData.notRecorded');

const getPatientIdentifier = (row) =>
  row?.appPatientCode || row?.patientCode;

const getTrackingPatientDataRows = (row, t) => {
  if (!row) return [];

  return [
    {
      key: 'patient-name',
      label: t('ventilation.tracking.patientData.patientName'),
      value: getDisplayValue(getPatientLabel(row, t), t),
    },
    {
      key: 'patient-code',
      label: t('ventilation.tracking.patientData.patientCode'),
      value: getDisplayValue(getPatientIdentifier(row), t),
    },
    {
      key: 'admission-code',
      label: t('ventilation.tracking.patientData.admissionCode'),
      value: getDisplayValue(row.appAdmissionCode, t),
    },
    {
      key: 'admission-status',
      label: t('ventilation.tracking.patientData.admissionStatus'),
      value: getDisplayValue(row.admissionStatusLabel, t),
    },
    {
      key: 'admission-date',
      label: t('ventilation.tracking.patientData.admissionDate'),
      value: getDisplayValue(row.admittedDateLabel, t),
    },
    {
      key: 'admission-time',
      label: t('ventilation.tracking.patientData.admissionTime'),
      value: getDisplayValue(row.admittedTimeLabel, t),
    },
    {
      key: 'bed',
      label: t('ventilation.tracking.patientData.bed'),
      value: getDisplayValue(row.bedNumber, t),
    },
    {
      key: 'admission-source',
      label: t('ventilation.tracking.patientData.admissionSource'),
      value: getDisplayValue(row.admissionSource, t),
    },
    {
      key: 'reason-for-ventilation',
      label: t('ventilation.tracking.patientData.reasonForVentilation'),
      value: getDisplayValue(row.reasonForVentilation, t),
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
      key: 'sex-for-size',
      label: t('ventilation.tracking.patientData.sexForSize'),
      value: getDisplayValue(row.sexForSizeCalculations, t),
    },
    {
      key: 'gestational-age',
      label: t('ventilation.tracking.patientData.gestationalAge'),
      value: getDisplayValue(formatWeeks(row.gestationalAgeWeeks), t),
    },
    {
      key: 'corrected-age',
      label: t('ventilation.tracking.patientData.correctedAge'),
      value: getDisplayValue(formatWeeks(row.correctedAgeWeeks), t),
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
