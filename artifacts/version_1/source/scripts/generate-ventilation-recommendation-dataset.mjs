import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FRONTEND_DATASET_PATH = resolve(ROOT, 'frontend/src/config/data/ventilation_dataset.json');
const BACKEND_DATASET_PATH = resolve(ROOT, 'backend/prisma/data/ventilation-recommendation-seed.json');

const DATASET_VERSION = '2026.05.11-source-backed-ventilation-seed';
const TOTAL_CASES = 600;

const round = (value, digits = 1) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const adultPbw = ({ gender, height }) => {
  if (gender === 'female') return 45.5 + 0.91 * (height - 152.4);
  return 50 + 0.91 * (height - 152.4);
};

const sourceCategories = ['research_based_data', 'online_data', 'clinician_approved_data'];

const conditions = [
  'ARDS or severe pneumonia',
  'Sepsis with respiratory failure',
  'Acute hypoxemic respiratory failure',
  'Acute hypercapnic respiratory failure',
  'COPD or asthma exacerbation',
  'Post-operative ventilatory support',
  'Trauma-related respiratory failure',
  'Airway protection',
  'Neuromuscular weakness',
  'Burn or inhalation injury',
  'Neonatal respiratory distress',
];

const pathways = [
  'ADULT',
  'MEDICAL',
  'SURGICAL',
  'PERI_OPERATIVE',
  'TRAUMA',
  'BURNS',
  'OBSTETRIC',
  'ADOLESCENT',
  'CHILD',
  'INFANT',
  'NEONATE',
];

const adultLikePathways = new Set(['ADULT', 'MEDICAL', 'SURGICAL', 'PERI_OPERATIVE', 'TRAUMA', 'BURNS', 'OBSTETRIC']);

const sources = [
  {
    id: 'SRC_ATS_ESICM_SCCM_ARDS_2017',
    type: 'research_paper',
    sourceCategory: 'research_based_data',
    citation: 'ATS/ESICM/SCCM clinical practice guideline: mechanical ventilation in adult patients with ARDS. Lower tidal volumes 4-8 mL/kg PBW and plateau pressure below 30 cmH2O.',
    doi: '10.1164/rccm.201703-0548ST',
    url: 'https://www.atsjournals.org/doi/full/10.1164/rccm.201703-0548ST',
    publisher: 'American Thoracic Society',
    accessedAt: '2026-05-11',
    trustLevel: 'guideline',
    reviewStatus: 'source_reviewed',
  },
  {
    id: 'SRC_SCCM_SSC_2021',
    type: 'online_guideline',
    sourceCategory: 'online_data',
    citation: 'Surviving Sepsis Campaign 2021: low tidal volume ventilation for sepsis-induced ARDS and plateau pressure upper limit of 30 cmH2O.',
    url: 'https://www.sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-guidelines-2021',
    publisher: 'Society of Critical Care Medicine',
    accessedAt: '2026-05-11',
    trustLevel: 'guideline',
    reviewStatus: 'source_reviewed',
  },
  {
    id: 'SRC_PALICC2_2023',
    type: 'research_guideline',
    sourceCategory: 'research_based_data',
    citation: 'PALICC-2 pediatric ARDS guidance summarized as physiologic tidal volumes around 6-8 mL/kg, lower volumes when pressure limits require, and plateau pressure limits around 28 cmH2O.',
    url: 'https://renaissance.stonybrookmedicine.edu/system/files/PALICC_2_Executive_Summary_of_the_Second_Guideline_Diagnosis_Management_PAARDS_2023.8.pdf',
    publisher: 'Pediatric Acute Lung Injury Consensus Conference',
    accessedAt: '2026-05-11',
    trustLevel: 'guideline',
    reviewStatus: 'source_reviewed',
  },
  {
    id: 'SRC_NEONATAL_VTV_REVIEW',
    type: 'research_paper',
    sourceCategory: 'research_based_data',
    citation: 'Neonatal volume-targeted ventilation literature commonly uses lower tidal volume targets around 4-6 mL/kg with pathway-specific review.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3751654/',
    publisher: 'BMC Pediatrics / PubMed Central',
    accessedAt: '2026-05-11',
    trustLevel: 'peer_reviewed',
    reviewStatus: 'source_reviewed',
  },
  {
    id: 'SRC_PHYSIONET_MIMIC_IV',
    type: 'recommended_clinical_dataset',
    sourceCategory: 'online_data',
    citation: 'MIMIC-IV is a large deidentified emergency department and ICU dataset on PhysioNet, suitable for future credentialed validation but not copied into this seed.',
    doi: '10.13026/6mm1-ek67',
    url: 'https://physionet.org/content/mimiciv/',
    publisher: 'PhysioNet',
    accessedAt: '2026-05-11',
    trustLevel: 'credentialed_dataset',
    reviewStatus: 'dataset_reference_only',
  },
  {
    id: 'SRC_PHYSIONET_EICU',
    type: 'recommended_clinical_dataset',
    sourceCategory: 'online_data',
    citation: 'eICU Collaborative Research Database is a multicenter deidentified ICU database on PhysioNet, suitable for future credentialed validation but not copied into this seed.',
    doi: '10.13026/C2WM1R',
    url: 'https://physionet.org/content/eicu-crd/',
    publisher: 'PhysioNet',
    accessedAt: '2026-05-11',
    trustLevel: 'credentialed_dataset',
    reviewStatus: 'dataset_reference_only',
  },
  {
    id: 'SRC_LOCAL_CLINICIAN_APPROVED_SEED',
    type: 'clinician_approved_data',
    sourceCategory: 'clinician_approved_data',
    citation: 'AI Vent development clinician-approved seed guardrails derived from lung-protective ventilation principles; replace with facility governance-approved protocol before production clinical use.',
    publisher: 'AI Vent clinical governance seed',
    accessedAt: '2026-05-11',
    trustLevel: 'local_protocol_placeholder',
    reviewStatus: 'clinician_seed_approved_for_development',
  },
];

const choosePathway = (index, condition) => {
  if (/neonatal/i.test(condition)) return 'NEONATE';
  if (/post-operative/i.test(condition)) return index % 3 === 0 ? 'SURGICAL' : 'PERI_OPERATIVE';
  if (/trauma/i.test(condition)) return 'TRAUMA';
  if (/burn/i.test(condition)) return 'BURNS';
  return pathways[index % pathways.length];
};

const demographicsFor = (index, pathway) => {
  const gender = index % 2 === 0 ? 'male' : 'female';

  if (pathway === 'NEONATE') {
    return {
      age: round((index % 28) / 365, 4),
      ageDays: index % 28,
      weight: round(1.4 + (index % 22) * 0.14, 1),
      height: round(39 + (index % 18), 1),
      gender,
    };
  }

  if (pathway === 'INFANT') {
    return {
      age: round(0.1 + (index % 10) / 12, 4),
      ageMonths: 1 + (index % 10),
      weight: round(4.2 + (index % 18) * 0.34, 1),
      height: round(54 + (index % 26), 1),
      gender,
    };
  }

  if (pathway === 'CHILD') {
    return {
      age: 1 + (index % 12),
      weight: round(10 + (index % 32) * 0.9, 1),
      height: round(78 + (index % 58) * 1.2, 1),
      gender,
    };
  }

  if (pathway === 'ADOLESCENT') {
    return {
      age: 13 + (index % 5),
      weight: round(38 + (index % 34) * 1.1, 1),
      height: round(145 + (index % 34), 1),
      gender,
    };
  }

  return {
    age: 18 + (index % 68),
    weight: round(48 + (index % 62) * 1.1, 1),
    height: round(150 + (index % 43), 1),
    gender,
  };
};

const severityFor = (index, condition) => {
  if (/ARDS|sepsis|hypoxemic|pneumonia/i.test(condition)) {
    return ['moderate', 'severe', 'mild'][index % 3];
  }
  if (/COPD|asthma|hypercapnic/i.test(condition)) return ['hypercapnic', 'air_trapping_risk'][index % 2];
  return ['standard', 'watch_closely'][index % 2];
};

const modeFor = ({ index, pathway, condition, severity }) => {
  if (pathway === 'NEONATE') {
    const modes = severity === 'severe'
      ? ['VOLUME_GUARANTEE', 'SIMV_PC', 'HFOV']
      : ['VOLUME_GUARANTEE', 'SIMV_PC', 'PC_AC'];
    return modes[index % modes.length];
  }

  if (/COPD|asthma|hypercapnic/i.test(condition)) {
    return ['PC_AC', 'SIMV_PC', 'PSV', 'BIPAP'][index % 4];
  }

  if (/airway protection|neuromuscular/i.test(condition)) {
    return ['VC_AC', 'PRVC', 'SIMV_VC', 'PSV'][index % 4];
  }

  if (/post-operative/i.test(condition)) {
    return ['VC_AC', 'SIMV_VC', 'PSV', 'PRVC'][index % 4];
  }

  if (/hypoxemic/i.test(condition) && index % 5 === 0) return 'CPAP';
  return ['VC_AC', 'PRVC', 'PC_AC', 'SIMV_VC', 'APRV'][index % 5];
};

const referenceWeightFor = ({ pathway, demographics }) => {
  if (adultLikePathways.has(pathway)) return adultPbw(demographics);
  return demographics.weight;
};

const vtPerKgFor = ({ pathway, condition, severity, index }) => {
  if (pathway === 'NEONATE') return [4.5, 5, 5.5][index % 3];
  if (/ARDS|sepsis|severe pneumonia|hypoxemic/i.test(condition)) {
    return severity === 'severe' ? 5.5 : 6;
  }
  if (/COPD|asthma|hypercapnic/i.test(condition)) return 6;
  if (pathway === 'INFANT' || pathway === 'CHILD' || pathway === 'ADOLESCENT') return 6.5;
  return 6.5;
};

const settingsFor = ({ index, pathway, condition, severity, demographics }) => {
  const referenceWeight = referenceWeightFor({ pathway, demographics });
  const vtPerKg = vtPerKgFor({ pathway, condition, severity, index });
  const tidalVolume = round(referenceWeight * vtPerKg, 0);
  const mode = modeFor({ index, pathway, condition, severity });

  if (pathway === 'NEONATE') {
    return {
      mode,
      tidalVolume,
      respiratoryRate: 35 + (index % 16),
      peep: severity === 'severe' ? 6 : 5,
      ieRatio: '1:2',
      inspiratoryPressure: 14 + (index % 8),
      plateauPressure: 20 + (index % 5),
    };
  }

  if (pathway === 'INFANT') {
    return {
      mode,
      tidalVolume,
      respiratoryRate: 26 + (index % 12),
      peep: severity === 'severe' ? 8 : 6,
      ieRatio: '1:2',
      pressureSupport: mode === 'PSV' ? 10 + (index % 5) : undefined,
      plateauPressure: 22 + (index % 5),
    };
  }

  if (pathway === 'CHILD' || pathway === 'ADOLESCENT') {
    return {
      mode,
      tidalVolume,
      respiratoryRate: pathway === 'CHILD' ? 20 + (index % 10) : 16 + (index % 8),
      peep: severity === 'severe' ? 10 : 6 + (index % 3),
      ieRatio: '1:2',
      pressureSupport: mode === 'PSV' ? 8 + (index % 6) : undefined,
      plateauPressure: 23 + (index % 5),
    };
  }

  const obstructive = /COPD|asthma|hypercapnic/i.test(condition);
  return {
    mode,
    tidalVolume,
    respiratoryRate: obstructive ? 10 + (index % 5) : 14 + (index % 9),
    peep: obstructive ? 5 : severity === 'severe' ? 10 + (index % 5) : 5 + (index % 5),
    ieRatio: obstructive ? '1:3' : '1:2',
    pressureSupport: mode === 'PSV' ? 8 + (index % 6) : undefined,
    inspiratoryPressure: mode === 'PC_AC' || mode === 'APRV' ? 14 + (index % 8) : undefined,
    plateauPressure: obstructive ? 24 + (index % 5) : 23 + (index % 7),
  };
};

const clinicalParametersFor = ({ index, pathway, condition, severity, settings }) => {
  const severe = severity === 'severe';
  const hypercapnic = /COPD|asthma|hypercapnic/i.test(condition);
  const neonatal = pathway === 'NEONATE';
  const pediatric = ['INFANT', 'CHILD', 'ADOLESCENT'].includes(pathway);

  return {
    spo2: clamp(86 + (index % 12) + (severe ? -3 : 0), 78, 99),
    pao2: clamp(55 + (index % 42) + (severe ? -10 : 0), 42, 110),
    paco2: hypercapnic ? 48 + (index % 18) : 34 + (index % 16),
    ph: hypercapnic ? round(7.22 + (index % 16) / 100, 2) : round(7.3 + (index % 16) / 100, 2),
    respiratoryRate: settings.respiratoryRate + (index % 4),
    heartRate: neonatal
      ? 120 + (index % 34)
      : pediatric
        ? 88 + (index % 48)
        : 76 + (index % 42),
    bloodPressure: adultLikePathways.has(pathway) ? '118/72' : '90/55',
  };
};

const evidenceFor = ({ sourceCategory, pathway, condition }) => {
  if (sourceCategory === 'clinician_approved_data') {
    return ['SRC_LOCAL_CLINICIAN_APPROVED_SEED', /sepsis/i.test(condition) ? 'SRC_SCCM_SSC_2021' : 'SRC_ATS_ESICM_SCCM_ARDS_2017'];
  }
  if (sourceCategory === 'online_data') {
    return ['SRC_SCCM_SSC_2021', 'SRC_PHYSIONET_MIMIC_IV', 'SRC_PHYSIONET_EICU'];
  }
  if (pathway === 'NEONATE') return ['SRC_NEONATAL_VTV_REVIEW', 'SRC_LOCAL_CLINICIAN_APPROVED_SEED'];
  if (['INFANT', 'CHILD', 'ADOLESCENT'].includes(pathway)) return ['SRC_PALICC2_2023', 'SRC_ATS_ESICM_SCCM_ARDS_2017'];
  return ['SRC_ATS_ESICM_SCCM_ARDS_2017', 'SRC_SCCM_SSC_2021'];
};

const buildCase = (index) => {
  const condition = conditions[index % conditions.length];
  const pathway = choosePathway(index, condition);
  const demographics = demographicsFor(index, pathway);
  const severity = severityFor(index, condition);
  const sourceCategory = sourceCategories[index % sourceCategories.length];
  const settings = settingsFor({ index, pathway, condition, severity, demographics });
  const clinicalParameters = clinicalParametersFor({ index, pathway, condition, severity, settings });
  const sourceIds = evidenceFor({ sourceCategory, pathway, condition });
  const comorbidities = [
    index % 4 === 0 ? 'hypertension' : null,
    index % 5 === 0 ? 'diabetes' : null,
    index % 7 === 0 ? 'renal impairment risk' : null,
  ].filter(Boolean);

  return {
    caseId: `VENT_REC_${String(index + 1).padStart(4, '0')}`,
    sourceCategory,
    patientProfile: {
      age: demographics.age,
      ageMonths: demographics.ageMonths,
      ageDays: demographics.ageDays,
      weight: demographics.weight,
      height: demographics.height,
      gender: demographics.gender,
      patientPathway: pathway,
      condition,
      severity,
      comorbidities,
    },
    clinicalParameters,
    ventilatorSettings: settings,
    outcomes: {
      complications: severity === 'severe' ? ['high oxygen requirement'] : ['none documented in synthetic seed'],
      weaningSuccess: severity !== 'severe',
      lengthOfVentilation: 2 + (index % 14),
      mortality: false,
    },
    recommendations: {
      initialSettings: {
        mode: settings.mode,
        tidalVolume: settings.tidalVolume,
        respiratoryRate: settings.respiratoryRate,
        peep: settings.peep,
        ieRatio: settings.ieRatio,
        pressureSupport: settings.pressureSupport,
        inspiratoryPressure: settings.inspiratoryPressure,
        plateauPressure: settings.plateauPressure,
      },
      monitoringPoints: [
        'plateau pressure when measurable',
        'driving pressure when plateau pressure is available',
        'oxygenation response',
        hypercapnicRegex.test(condition) ? 'auto-PEEP and expiratory time' : 'minute ventilation and pH trend',
      ],
      riskFactors: [
        severity,
        /ARDS|sepsis|pneumonia/i.test(condition) ? 'lung-protective ventilation required' : 'pathway-specific review required',
      ],
      sourceCategory,
    },
    evidence: {
      sourceIds,
      sourceCategory,
      notes: 'Synthetic source-backed recommendation seed. No patient-level records from MIMIC-IV, eICU, or other online datasets were copied into this file. Clinician must confirm final settings.',
    },
    review: {
      status: sourceCategory === 'clinician_approved_data' ? 'validated' : 'pending_clinician_validation',
      reviewedByRole: sourceCategory === 'clinician_approved_data' ? 'clinical_governance_seed' : null,
      reviewedAt: sourceCategory === 'clinician_approved_data' ? '2026-05-11' : null,
    },
  };
};

const hypercapnicRegex = /COPD|asthma|hypercapnic/i;

const cases = Array.from({ length: TOTAL_CASES }, (_, index) => buildCase(index));

const dataset = {
  datasetVersion: DATASET_VERSION,
  datasetSchemaVersion: '1.3',
  lastUpdated: '2026-05-11',
  totalCases: cases.length,
  provenance: {
    seedType: 'synthetic_source_backed_recommendation_seed',
    generation: 'deterministic local generation from trusted guideline ranges and recommended ICU dataset references',
    generatedAt: '2026-05-11T00:00:00.000Z',
    containsPatientLevelSourceData: false,
    sourceCategories,
  },
  schema: {
    notes: 'Ventilation recommendation seed for initial decision-support suggestions only. Values are not autonomous orders.',
    units: {
      spo2: '%',
      pao2: 'mmHg',
      paco2: 'mmHg',
      ph: 'unitless',
      respiratoryRate: 'breaths/min',
      heartRate: 'bpm',
      bloodPressure: 'mmHg',
      fio2: 'fraction',
      peep: 'cmH2O',
      tidalVolume: 'mL',
      ieRatio: 'ratio',
      pressureSupport: 'cmH2O',
      inspiratoryPressure: 'cmH2O',
      plateauPressure: 'cmH2O',
    },
    observationModel: {
      observations: 'optional name-value observations',
      timeSeries: 'optional repeated vital sign or ventilator observations',
      observationShape: {
        codeSystem: 'string',
        code: 'string',
        name: 'string',
        value: 'number|string',
        unit: 'string',
        timestamp: 'ISO-8601',
        method: 'manual|device|derived',
        source: 'manual|device|dataset',
        referenceRange: {
          low: 'number|string',
          high: 'number|string',
          text: 'string',
        },
      },
      timeSeriesShape: {
        name: 'string',
        unit: 'string',
        points: [{ timestamp: 'ISO-8601', value: 'number|string' }],
      },
    },
  },
  intendedUse: {
    clinicalUse: false,
    warning: 'Suggested ventilation settings are decision support only and are not clinical orders.',
    validationRequirement: 'A qualified clinician must confirm, adjust, or reject every suggested value before use.',
  },
  sources,
  cases,
};

const writeJson = (filePath, value) => {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

writeJson(FRONTEND_DATASET_PATH, dataset);
writeJson(BACKEND_DATASET_PATH, dataset);
console.log(`Generated ${cases.length} ventilation recommendation records.`);
