-- Collins Version 5 full database schema upload
-- Target: MySQL/MariaDB via phpMyAdmin or mysql CLI.
-- Generated: 2026-05-12T09:38:46.464Z
-- Import into an empty database to create the complete Version 5 schema and Prisma migration history.
-- Review production database credentials and take a backup before importing into an existing database.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE IF NOT EXISTS `_prisma_migrations` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `checksum` VARCHAR(64) NOT NULL,
  `finished_at` DATETIME(3) NULL,
  `migration_name` VARCHAR(255) NOT NULL,
  `logs` TEXT NULL,
  `rolled_back_at` DATETIME(3) NULL,
  `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` INT UNSIGNED NOT NULL DEFAULT 0
);

-- Migration: 20260505133000_init
-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INVITED', 'SUSPENDED', 'DEACTIVATED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefreshSession` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `tokenHash` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `revokedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RefreshSession_tokenHash_key`(`tokenHash`),
    INDEX `RefreshSession_userId_revokedAt_idx`(`userId`, `revokedAt`),
    INDEX `RefreshSession_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OnboardingState` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `status` ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'NOT_STARTED',
    `currentStep` ENUM('WELCOME', 'CLINICAL_SAFETY', 'USER_SETUP', 'FACILITY_SELECTION', 'MEMBERSHIP_REQUEST', 'COMPLETED') NOT NULL DEFAULT 'WELCOME',
    `completedStepsJson` JSON NULL,
    `selectedFacilityId` VARCHAR(191) NULL,
    `requestedRole` ENUM('PLATFORM_ADMIN', 'FACILITY_ADMIN', 'CLINICIAN', 'ICU_NURSE', 'SPECIALIST_REVIEWER', 'RESEARCH_GOVERNANCE_OFFICER', 'MODEL_GOVERNANCE_OFFICER', 'READ_ONLY_REVIEWER') NULL,
    `clinicalSafetyAcknowledgedAt` DATETIME(3) NULL,
    `clinicalSafetyAcknowledgementVersion` VARCHAR(191) NULL,
    `clinicalSafetyStatementHash` VARCHAR(191) NULL,
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `OnboardingState_userId_key`(`userId`),
    INDEX `OnboardingState_selectedFacilityId_status_idx`(`selectedFacilityId`, `status`),
    INDEX `OnboardingState_status_currentStep_idx`(`status`, `currentStep`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Facility` (
    `id` VARCHAR(191) NOT NULL,
    `registryCode` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NULL,
    `region` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `ownership` VARCHAR(191) NULL,
    `verificationStatus` ENUM('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED') NOT NULL DEFAULT 'PENDING',
    `oxygenProfileJson` JSON NULL,
    `ventilatorProfileJson` JSON NULL,
    `abgAvailability` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Facility_registryCode_key`(`registryCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSettings` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `activeFacilityId` VARCHAR(191) NULL,
    `roleVisibilityJson` JSON NULL,
    `offlineSyncPreferencesJson` JSON NULL,
    `privacyControlsJson` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserSettings_userId_key`(`userId`),
    INDEX `UserSettings_activeFacilityId_idx`(`activeFacilityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FacilitySettings` (
    `id` VARCHAR(191) NOT NULL,
    `facilityId` VARCHAR(191) NOT NULL,
    `referenceSettingsJson` JSON NULL,
    `workflowSettingsJson` JSON NULL,
    `privacyControlsJson` JSON NULL,
    `governanceSettingsJson` JSON NULL,
    `modelVisibilityJson` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FacilitySettings_facilityId_key`(`facilityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FacilityMembership` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `facilityId` VARCHAR(191) NOT NULL,
    `role` ENUM('PLATFORM_ADMIN', 'FACILITY_ADMIN', 'CLINICIAN', 'ICU_NURSE', 'SPECIALIST_REVIEWER', 'RESEARCH_GOVERNANCE_OFFICER', 'MODEL_GOVERNANCE_OFFICER', 'READ_ONLY_REVIEWER') NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED') NOT NULL DEFAULT 'PENDING',
    `approvedByUserId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FacilityMembership_facilityId_status_idx`(`facilityId`, `status`),
    INDEX `FacilityMembership_userId_status_idx`(`userId`, `status`),
    UNIQUE INDEX `FacilityMembership_userId_facilityId_role_key`(`userId`, `facilityId`, `role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Patient` (
    `id` VARCHAR(191) NOT NULL,
    `facilityId` VARCHAR(191) NOT NULL,
    `appPatientCode` VARCHAR(191) NOT NULL,
    `optionalName` VARCHAR(191) NULL,
    `hospitalNumber` VARCHAR(191) NULL,
    `patientPathway` ENUM('NEONATE', 'INFANT', 'CHILD', 'ADOLESCENT', 'ADULT', 'OBSTETRIC', 'BURNS', 'TRAUMA', 'PERI_OPERATIVE', 'MEDICAL', 'SURGICAL', 'UNKNOWN', 'OTHER') NOT NULL,
    `dateOfBirth` DATETIME(3) NULL,
    `ageYears` INTEGER NULL,
    `ageMonths` INTEGER NULL,
    `estimatedAge` BOOLEAN NOT NULL DEFAULT false,
    `gestationalAgeWeeks` DOUBLE NULL,
    `correctedAgeWeeks` DOUBLE NULL,
    `sexForSizeCalculations` ENUM('MALE', 'FEMALE', 'UNKNOWN') NOT NULL DEFAULT 'UNKNOWN',
    `actualWeightKg` DOUBLE NULL,
    `heightOrLengthCm` DOUBLE NULL,
    `referenceWeightKg` DOUBLE NULL,
    `referenceWeightMethod` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Patient_facilityId_hospitalNumber_idx`(`facilityId`, `hospitalNumber`),
    INDEX `Patient_facilityId_patientPathway_idx`(`facilityId`, `patientPathway`),
    UNIQUE INDEX `Patient_facilityId_appPatientCode_key`(`facilityId`, `appPatientCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admission` (
    `id` VARCHAR(191) NOT NULL,
    `patientId` VARCHAR(191) NOT NULL,
    `facilityId` VARCHAR(191) NOT NULL,
    `appAdmissionCode` VARCHAR(191) NOT NULL,
    `bedNumber` VARCHAR(191) NULL,
    `admittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `admissionSource` VARCHAR(191) NULL,
    `reasonForVentilation` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'TRANSFERRED', 'DISCHARGED', 'DECEASED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    `createdByUserId` VARCHAR(191) NULL,
    `reviewStatus` ENUM('PENDING', 'APPROVED', 'CORRECTION_REQUESTED', 'EXCLUDED') NOT NULL DEFAULT 'PENDING',
    `clientRecordId` VARCHAR(191) NULL,
    `deviceId` VARCHAR(191) NULL,
    `clientCreatedAt` DATETIME(3) NULL,
    `clientUpdatedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Admission_facilityId_status_idx`(`facilityId`, `status`),
    INDEX `Admission_patientId_idx`(`patientId`),
    INDEX `Admission_clientRecordId_idx`(`clientRecordId`),
    UNIQUE INDEX `Admission_facilityId_appAdmissionCode_key`(`facilityId`, `appAdmissionCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClinicalSnapshot` (
    `id` VARCHAR(191) NOT NULL,
    `admissionId` VARCHAR(191) NOT NULL,
    `measuredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `oxygenSupportType` VARCHAR(191) NULL,
    `heartRate` DOUBLE NULL,
    `respiratoryRate` DOUBLE NULL,
    `systolicBp` DOUBLE NULL,
    `diastolicBp` DOUBLE NULL,
    `meanArterialPressure` DOUBLE NULL,
    `temperatureC` DOUBLE NULL,
    `spo2` DOUBLE NULL,
    `fio2` DOUBLE NULL,
    `gcs` DOUBLE NULL,
    `avpu` VARCHAR(191) NULL,
    `rass` DOUBLE NULL,
    `mainCondition` VARCHAR(191) NULL,
    `comorbiditiesJson` JSON NULL,
    `validationStatus` VARCHAR(191) NULL,
    `source` VARCHAR(191) NULL,
    `enteredByUserId` VARCHAR(191) NULL,
    `clientRecordId` VARCHAR(191) NULL,
    `deviceId` VARCHAR(191) NULL,
    `clientCreatedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ClinicalSnapshot_admissionId_measuredAt_idx`(`admissionId`, `measuredAt`),
    INDEX `ClinicalSnapshot_clientRecordId_idx`(`clientRecordId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AbgTest` (
    `id` VARCHAR(191) NOT NULL,
    `admissionId` VARCHAR(191) NOT NULL,
    `version` INTEGER NOT NULL DEFAULT 1,
    `collectedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ph` DOUBLE NULL,
    `pao2` DOUBLE NULL,
    `paco2` DOUBLE NULL,
    `hco3` DOUBLE NULL,
    `baseExcess` DOUBLE NULL,
    `lactate` DOUBLE NULL,
    `fio2AtSample` DOUBLE NULL,
    `spo2AtSample` DOUBLE NULL,
    `source` VARCHAR(191) NULL,
    `validationStatus` VARCHAR(191) NULL,
    `clinicalFlagsJson` JSON NULL,
    `calculationSummaryJson` JSON NULL,
    `enteredByUserId` VARCHAR(191) NULL,
    `reviewedByUserId` VARCHAR(191) NULL,
    `reviewStatus` ENUM('PENDING', 'APPROVED', 'CORRECTION_REQUESTED', 'EXCLUDED') NOT NULL DEFAULT 'PENDING',
    `clientRecordId` VARCHAR(191) NULL,
    `deviceId` VARCHAR(191) NULL,
    `clientCreatedAt` DATETIME(3) NULL,
    `clientUpdatedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AbgTest_admissionId_collectedAt_idx`(`admissionId`, `collectedAt`),
    INDEX `AbgTest_reviewStatus_idx`(`reviewStatus`),
    INDEX `AbgTest_clientRecordId_idx`(`clientRecordId`),
    UNIQUE INDEX `AbgTest_admissionId_version_key`(`admissionId`, `version`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VentilatorSetting` (
    `id` VARCHAR(191) NOT NULL,
    `admissionId` VARCHAR(191) NOT NULL,
    `version` INTEGER NOT NULL DEFAULT 1,
    `measuredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `mode` VARCHAR(191) NULL,
    `tidalVolumeMl` DOUBLE NULL,
    `respiratoryRateSet` DOUBLE NULL,
    `respiratoryRateMeasured` DOUBLE NULL,
    `fio2` DOUBLE NULL,
    `peep` DOUBLE NULL,
    `pressureSupport` DOUBLE NULL,
    `inspiratoryPressure` DOUBLE NULL,
    `peakPressure` DOUBLE NULL,
    `plateauPressure` DOUBLE NULL,
    `ieRatio` VARCHAR(191) NULL,
    `minuteVolumeLMin` DOUBLE NULL,
    `vtMlPerKgReferenceWeight` DOUBLE NULL,
    `drivingPressure` DOUBLE NULL,
    `source` VARCHAR(191) NULL,
    `validationStatus` VARCHAR(191) NULL,
    `clinicalFlagsJson` JSON NULL,
    `calculationSummaryJson` JSON NULL,
    `enteredByUserId` VARCHAR(191) NULL,
    `reviewStatus` ENUM('PENDING', 'APPROVED', 'CORRECTION_REQUESTED', 'EXCLUDED') NOT NULL DEFAULT 'PENDING',
    `clientRecordId` VARCHAR(191) NULL,
    `deviceId` VARCHAR(191) NULL,
    `clientCreatedAt` DATETIME(3) NULL,
    `clientUpdatedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `VentilatorSetting_admissionId_measuredAt_idx`(`admissionId`, `measuredAt`),
    INDEX `VentilatorSetting_reviewStatus_idx`(`reviewStatus`),
    INDEX `VentilatorSetting_clientRecordId_idx`(`clientRecordId`),
    UNIQUE INDEX `VentilatorSetting_admissionId_version_key`(`admissionId`, `version`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AirwayDevice` (
    `id` VARCHAR(191) NOT NULL,
    `admissionId` VARCHAR(191) NOT NULL,
    `measuredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `airwayRoute` VARCHAR(191) NULL,
    `tubeType` VARCHAR(191) NULL,
    `internalDiameterMm` DOUBLE NULL,
    `depthCm` DOUBLE NULL,
    `cuffPressureCmH2O` DOUBLE NULL,
    `tubeSecured` BOOLEAN NULL,
    `notes` TEXT NULL,
    `validationStatus` VARCHAR(191) NULL,
    `clinicalFlagsJson` JSON NULL,
    `enteredByUserId` VARCHAR(191) NULL,
    `clientRecordId` VARCHAR(191) NULL,
    `deviceId` VARCHAR(191) NULL,
    `clientCreatedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AirwayDevice_admissionId_measuredAt_idx`(`admissionId`, `measuredAt`),
    INDEX `AirwayDevice_clientRecordId_idx`(`clientRecordId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HumidificationDecision` (
    `id` VARCHAR(191) NOT NULL,
    `admissionId` VARCHAR(191) NOT NULL,
    `measuredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `method` VARCHAR(191) NULL,
    `thickSecretions` BOOLEAN NULL,
    `highMinuteVentilation` BOOLEAN NULL,
    `hypothermia` BOOLEAN NULL,
    `airwayBleeding` BOOLEAN NULL,
    `expectedLongVentilation` BOOLEAN NULL,
    `suggestedOption` VARCHAR(191) NULL,
    `confirmedOption` VARCHAR(191) NULL,
    `clinicalFlagsJson` JSON NULL,
    `confirmedByUserId` VARCHAR(191) NULL,
    `clientRecordId` VARCHAR(191) NULL,
    `deviceId` VARCHAR(191) NULL,
    `clientCreatedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `HumidificationDecision_admissionId_measuredAt_idx`(`admissionId`, `measuredAt`),
    INDEX `HumidificationDecision_clientRecordId_idx`(`clientRecordId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyVentilationReview` (
    `id` VARCHAR(191) NOT NULL,
    `admissionId` VARCHAR(191) NOT NULL,
    `reviewDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `oxygenationStable` BOOLEAN NULL,
    `hemodynamicsStable` BOOLEAN NULL,
    `sedationLightEnough` BOOLEAN NULL,
    `secretionsManageable` BOOLEAN NULL,
    `sbtStatus` VARCHAR(191) NULL,
    `sbtFailureReason` VARCHAR(191) NULL,
    `proneStatus` VARCHAR(191) NULL,
    `vapBundleJson` JSON NULL,
    `clinicalFlagsJson` JSON NULL,
    `reviewedByUserId` VARCHAR(191) NULL,
    `clientRecordId` VARCHAR(191) NULL,
    `deviceId` VARCHAR(191) NULL,
    `clientCreatedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DailyVentilationReview_admissionId_reviewDate_idx`(`admissionId`, `reviewDate`),
    INDEX `DailyVentilationReview_clientRecordId_idx`(`clientRecordId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Outcome` (
    `id` VARCHAR(191) NOT NULL,
    `admissionId` VARCHAR(191) NOT NULL,
    `outcomeType` ENUM('EXTUBATED', 'TRANSFERRED', 'DISCHARGED', 'DECEASED', 'STILL_ADMITTED', 'OTHER') NOT NULL,
    `outcomeDate` DATETIME(3) NULL,
    `ventilatorDays` DOUBLE NULL,
    `icuLengthOfStayDays` DOUBLE NULL,
    `hospitalLengthOfStayDays` DOUBLE NULL,
    `reintubationWithin48h` BOOLEAN NULL,
    `tracheostomy` BOOLEAN NULL,
    `vapSuspected` BOOLEAN NULL,
    `notes` TEXT NULL,
    `enteredByUserId` VARCHAR(191) NULL,
    `clientRecordId` VARCHAR(191) NULL,
    `deviceId` VARCHAR(191) NULL,
    `clientCreatedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Outcome_admissionId_outcomeDate_idx`(`admissionId`, `outcomeDate`),
    INDEX `Outcome_clientRecordId_idx`(`clientRecordId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReviewAction` (
    `id` VARCHAR(191) NOT NULL,
    `facilityId` VARCHAR(191) NULL,
    `reviewerUserId` VARCHAR(191) NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `statusBefore` VARCHAR(191) NULL,
    `statusAfter` VARCHAR(191) NULL,
    `validationStatus` VARCHAR(191) NULL,
    `triagePriority` VARCHAR(191) NULL,
    `overrideReason` TEXT NULL,
    `correctionJson` JSON NULL,
    `returnedToClinician` BOOLEAN NOT NULL DEFAULT false,
    `comment` TEXT NULL,
    `beforeJson` JSON NULL,
    `afterJson` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ReviewAction_facilityId_entityType_entityId_idx`(`facilityId`, `entityType`, `entityId`),
    INDEX `ReviewAction_reviewerUserId_createdAt_idx`(`reviewerUserId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DatasetCase` (
    `id` VARCHAR(191) NOT NULL,
    `facilityId` VARCHAR(191) NOT NULL,
    `sourceAdmissionId` VARCHAR(191) NULL,
    `sourceType` VARCHAR(191) NOT NULL,
    `sourcePayloadJson` JSON NULL,
    `structuredPreviewJson` JSON NULL,
    `deidentifiedPayloadJson` JSON NOT NULL,
    `deidentificationStatus` VARCHAR(191) NULL,
    `reviewStatus` ENUM('DRAFT', 'SUBMITTED', 'NEEDS_CORRECTION', 'REVIEWED', 'APPROVED_FOR_DATASET', 'APPROVED_FOR_TRAINING', 'EXCLUDED') NOT NULL DEFAULT 'SUBMITTED',
    `approvedForTraining` BOOLEAN NOT NULL DEFAULT false,
    `approvedByUserId` VARCHAR(191) NULL,
    `reviewedByUserId` VARCHAR(191) NULL,
    `reviewedAt` DATETIME(3) NULL,
    `ethicsApprovalId` VARCHAR(191) NULL,
    `governanceJson` JSON NULL,
    `datasetVersion` VARCHAR(191) NULL,
    `exclusionReason` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `DatasetCase_facilityId_reviewStatus_idx`(`facilityId`, `reviewStatus`),
    INDEX `DatasetCase_approvedForTraining_datasetVersion_idx`(`approvedForTraining`, `datasetVersion`),
    INDEX `DatasetCase_sourceAdmissionId_idx`(`sourceAdmissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReferenceRule` (
    `id` VARCHAR(191) NOT NULL,
    `facilityId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `version` VARCHAR(191) NOT NULL,
    `clinicalCondition` VARCHAR(191) NULL,
    `scenario` VARCHAR(191) NULL,
    `patientPathway` ENUM('NEONATE', 'INFANT', 'CHILD', 'ADOLESCENT', 'ADULT', 'OBSTETRIC', 'BURNS', 'TRAUMA', 'PERI_OPERATIVE', 'MEDICAL', 'SURGICAL', 'UNKNOWN', 'OTHER') NULL,
    `population` VARCHAR(191) NULL,
    `scope` ENUM('GLOBAL', 'FACILITY') NOT NULL DEFAULT 'GLOBAL',
    `parameterName` VARCHAR(191) NULL,
    `lowerBound` DOUBLE NULL,
    `upperBound` DOUBLE NULL,
    `unit` VARCHAR(191) NULL,
    `sourceCitation` TEXT NULL,
    `ruleJson` JSON NOT NULL,
    `activeFrom` DATETIME(3) NULL,
    `activeTo` DATETIME(3) NULL,
    `approvedByUserId` VARCHAR(191) NULL,
    `verifiedByUserId` VARCHAR(191) NULL,
    `verifiedAt` DATETIME(3) NULL,
    `verificationStatus` ENUM('DRAFT', 'PENDING_REVIEW', 'VERIFIED', 'CORRECTION_REQUESTED', 'REJECTED', 'RETIRED') NOT NULL DEFAULT 'PENDING_REVIEW',
    `reviewNotes` TEXT NULL,
    `auditTrailJson` JSON NULL,
    `governanceStatus` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ReferenceRule_activeFrom_activeTo_idx`(`activeFrom`, `activeTo`),
    INDEX `ReferenceRule_parameterName_patientPathway_population_idx`(`parameterName`, `patientPathway`, `population`),
    INDEX `ReferenceRule_facilityId_verificationStatus_idx`(`facilityId`, `verificationStatus`),
    INDEX `ReferenceRule_verificationStatus_activeFrom_activeTo_idx`(`verificationStatus`, `activeFrom`, `activeTo`),
    UNIQUE INDEX `ReferenceRule_name_version_key`(`name`, `version`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ModelVersion` (
    `id` VARCHAR(191) NOT NULL,
    `modelName` VARCHAR(191) NOT NULL,
    `version` VARCHAR(191) NOT NULL,
    `trainingDatasetVersion` VARCHAR(191) NULL,
    `intendedUse` TEXT NULL,
    `contraindicatedUse` TEXT NULL,
    `performanceSummaryJson` JSON NULL,
    `calibrationSummaryJson` JSON NULL,
    `biasAssessmentJson` JSON NULL,
    `approvalStatus` ENUM('DRAFT', 'SHADOW_MODE', 'APPROVED_FOR_LIVE_SUPPORT', 'RETIRED') NOT NULL DEFAULT 'DRAFT',
    `activatedAt` DATETIME(3) NULL,
    `retiredAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ModelVersion_approvalStatus_idx`(`approvalStatus`),
    UNIQUE INDEX `ModelVersion_modelName_version_key`(`modelName`, `version`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ModelOutput` (
    `id` VARCHAR(191) NOT NULL,
    `modelVersionId` VARCHAR(191) NOT NULL,
    `facilityId` VARCHAR(191) NULL,
    `sourceAdmissionId` VARCHAR(191) NULL,
    `inputSummaryJson` JSON NOT NULL,
    `outputJson` JSON NOT NULL,
    `visibleToClinicians` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ModelOutput_modelVersionId_createdAt_idx`(`modelVersionId`, `createdAt`),
    INDEX `ModelOutput_facilityId_createdAt_idx`(`facilityId`, `createdAt`),
    INDEX `ModelOutput_sourceAdmissionId_idx`(`sourceAdmissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IdempotencyRecord` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `facilityId` VARCHAR(191) NULL,
    `key` VARCHAR(191) NOT NULL,
    `operation` VARCHAR(191) NOT NULL,
    `requestHash` VARCHAR(191) NOT NULL,
    `responseJson` JSON NULL,
    `status` ENUM('LOCAL_DRAFT', 'WAITING_TO_SYNC', 'SYNCING', 'SYNCED', 'DUPLICATE', 'CONFLICT', 'FAILED', 'FAILED_VALIDATION', 'NEEDS_REVIEW', 'REVIEWED') NOT NULL DEFAULT 'SYNCED',
    `entityType` VARCHAR(191) NULL,
    `entityId` VARCHAR(191) NULL,
    `clientRecordId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `IdempotencyRecord_facilityId_operation_idx`(`facilityId`, `operation`),
    INDEX `IdempotencyRecord_clientRecordId_idx`(`clientRecordId`),
    UNIQUE INDEX `IdempotencyRecord_userId_key_key`(`userId`, `key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SyncEvent` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `facilityId` VARCHAR(191) NULL,
    `operation` VARCHAR(191) NOT NULL,
    `entityType` VARCHAR(191) NULL,
    `entityId` VARCHAR(191) NULL,
    `clientRecordId` VARCHAR(191) NULL,
    `idempotencyKey` VARCHAR(191) NULL,
    `status` ENUM('LOCAL_DRAFT', 'WAITING_TO_SYNC', 'SYNCING', 'SYNCED', 'DUPLICATE', 'CONFLICT', 'FAILED', 'FAILED_VALIDATION', 'NEEDS_REVIEW', 'REVIEWED') NOT NULL DEFAULT 'WAITING_TO_SYNC',
    `requestPayloadJson` JSON NULL,
    `responsePayloadJson` JSON NULL,
    `conflictPayloadJson` JSON NULL,
    `errorMessage` TEXT NULL,
    `clientCreatedAt` DATETIME(3) NULL,
    `clientUpdatedAt` DATETIME(3) NULL,
    `deviceId` VARCHAR(191) NULL,
    `receivedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `resolvedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SyncEvent_facilityId_status_idx`(`facilityId`, `status`),
    INDEX `SyncEvent_clientRecordId_idx`(`clientRecordId`),
    INDEX `SyncEvent_idempotencyKey_idx`(`idempotencyKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `facilityId` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NULL,
    `beforeJson` JSON NULL,
    `afterJson` JSON NULL,
    `reason` TEXT NULL,
    `requestId` VARCHAR(191) NULL,
    `ipHash` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditLog_facilityId_entityType_entityId_idx`(`facilityId`, `entityType`, `entityId`),
    INDEX `AuditLog_userId_createdAt_idx`(`userId`, `createdAt`),
    INDEX `AuditLog_action_createdAt_idx`(`action`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RefreshSession` ADD CONSTRAINT `RefreshSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OnboardingState` ADD CONSTRAINT `OnboardingState_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OnboardingState` ADD CONSTRAINT `OnboardingState_selectedFacilityId_fkey` FOREIGN KEY (`selectedFacilityId`) REFERENCES `Facility`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSettings` ADD CONSTRAINT `UserSettings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSettings` ADD CONSTRAINT `UserSettings_activeFacilityId_fkey` FOREIGN KEY (`activeFacilityId`) REFERENCES `Facility`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FacilitySettings` ADD CONSTRAINT `FacilitySettings_facilityId_fkey` FOREIGN KEY (`facilityId`) REFERENCES `Facility`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FacilityMembership` ADD CONSTRAINT `FacilityMembership_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FacilityMembership` ADD CONSTRAINT `FacilityMembership_facilityId_fkey` FOREIGN KEY (`facilityId`) REFERENCES `Facility`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FacilityMembership` ADD CONSTRAINT `FacilityMembership_approvedByUserId_fkey` FOREIGN KEY (`approvedByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_facilityId_fkey` FOREIGN KEY (`facilityId`) REFERENCES `Facility`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admission` ADD CONSTRAINT `Admission_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admission` ADD CONSTRAINT `Admission_facilityId_fkey` FOREIGN KEY (`facilityId`) REFERENCES `Facility`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admission` ADD CONSTRAINT `Admission_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClinicalSnapshot` ADD CONSTRAINT `ClinicalSnapshot_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `Admission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClinicalSnapshot` ADD CONSTRAINT `ClinicalSnapshot_enteredByUserId_fkey` FOREIGN KEY (`enteredByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AbgTest` ADD CONSTRAINT `AbgTest_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `Admission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AbgTest` ADD CONSTRAINT `AbgTest_enteredByUserId_fkey` FOREIGN KEY (`enteredByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AbgTest` ADD CONSTRAINT `AbgTest_reviewedByUserId_fkey` FOREIGN KEY (`reviewedByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VentilatorSetting` ADD CONSTRAINT `VentilatorSetting_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `Admission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VentilatorSetting` ADD CONSTRAINT `VentilatorSetting_enteredByUserId_fkey` FOREIGN KEY (`enteredByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AirwayDevice` ADD CONSTRAINT `AirwayDevice_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `Admission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AirwayDevice` ADD CONSTRAINT `AirwayDevice_enteredByUserId_fkey` FOREIGN KEY (`enteredByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HumidificationDecision` ADD CONSTRAINT `HumidificationDecision_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `Admission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HumidificationDecision` ADD CONSTRAINT `HumidificationDecision_confirmedByUserId_fkey` FOREIGN KEY (`confirmedByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyVentilationReview` ADD CONSTRAINT `DailyVentilationReview_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `Admission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyVentilationReview` ADD CONSTRAINT `DailyVentilationReview_reviewedByUserId_fkey` FOREIGN KEY (`reviewedByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Outcome` ADD CONSTRAINT `Outcome_admissionId_fkey` FOREIGN KEY (`admissionId`) REFERENCES `Admission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Outcome` ADD CONSTRAINT `Outcome_enteredByUserId_fkey` FOREIGN KEY (`enteredByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewAction` ADD CONSTRAINT `ReviewAction_facilityId_fkey` FOREIGN KEY (`facilityId`) REFERENCES `Facility`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewAction` ADD CONSTRAINT `ReviewAction_reviewerUserId_fkey` FOREIGN KEY (`reviewerUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DatasetCase` ADD CONSTRAINT `DatasetCase_facilityId_fkey` FOREIGN KEY (`facilityId`) REFERENCES `Facility`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DatasetCase` ADD CONSTRAINT `DatasetCase_sourceAdmissionId_fkey` FOREIGN KEY (`sourceAdmissionId`) REFERENCES `Admission`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DatasetCase` ADD CONSTRAINT `DatasetCase_approvedByUserId_fkey` FOREIGN KEY (`approvedByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DatasetCase` ADD CONSTRAINT `DatasetCase_reviewedByUserId_fkey` FOREIGN KEY (`reviewedByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReferenceRule` ADD CONSTRAINT `ReferenceRule_facilityId_fkey` FOREIGN KEY (`facilityId`) REFERENCES `Facility`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReferenceRule` ADD CONSTRAINT `ReferenceRule_approvedByUserId_fkey` FOREIGN KEY (`approvedByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReferenceRule` ADD CONSTRAINT `ReferenceRule_verifiedByUserId_fkey` FOREIGN KEY (`verifiedByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ModelOutput` ADD CONSTRAINT `ModelOutput_modelVersionId_fkey` FOREIGN KEY (`modelVersionId`) REFERENCES `ModelVersion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ModelOutput` ADD CONSTRAINT `ModelOutput_sourceAdmissionId_fkey` FOREIGN KEY (`sourceAdmissionId`) REFERENCES `Admission`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IdempotencyRecord` ADD CONSTRAINT `IdempotencyRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IdempotencyRecord` ADD CONSTRAINT `IdempotencyRecord_facilityId_fkey` FOREIGN KEY (`facilityId`) REFERENCES `Facility`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SyncEvent` ADD CONSTRAINT `SyncEvent_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SyncEvent` ADD CONSTRAINT `SyncEvent_facilityId_fkey` FOREIGN KEY (`facilityId`) REFERENCES `Facility`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_facilityId_fkey` FOREIGN KEY (`facilityId`) REFERENCES `Facility`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO `_prisma_migrations`
  (`id`, `checksum`, `migration_name`, `started_at`, `finished_at`, `applied_steps_count`)
SELECT '378ddddb-4d55-d7fb-aaea-c6017c54d71f', '4d23d867575e3e50fc66bfe380e3a90c487574c0f59b738bb3f87f5852cbab69', '20260505133000_init', NOW(3), NOW(3), 1
WHERE NOT EXISTS (SELECT 1 FROM `_prisma_migrations` WHERE `migration_name` = '20260505133000_init');

-- Migration: 20260505140600_patient_pathway_details
-- AlterTable
ALTER TABLE `Patient` ADD COLUMN `pathwayDetailsJson` JSON NULL;

INSERT INTO `_prisma_migrations`
  (`id`, `checksum`, `migration_name`, `started_at`, `finished_at`, `applied_steps_count`)
SELECT '4d7ad018-eeed-e76d-a8a2-37601ef0ccf3', 'e86f7e1efd453b88f372f8b0637f077ce53db6804e1a6fcbb7fa6c97f1fa66d6', '20260505140600_patient_pathway_details', NOW(3), NOW(3), 1
WHERE NOT EXISTS (SELECT 1 FROM `_prisma_migrations` WHERE `migration_name` = '20260505140600_patient_pathway_details');

-- Migration: 20260507090000_lowercase_snake_database_names
-- Drop existing foreign keys before renaming referenced tables and columns.
ALTER TABLE `RefreshSession` DROP FOREIGN KEY `RefreshSession_userId_fkey`;
ALTER TABLE `OnboardingState` DROP FOREIGN KEY `OnboardingState_userId_fkey`;
ALTER TABLE `OnboardingState` DROP FOREIGN KEY `OnboardingState_selectedFacilityId_fkey`;
ALTER TABLE `UserSettings` DROP FOREIGN KEY `UserSettings_userId_fkey`;
ALTER TABLE `UserSettings` DROP FOREIGN KEY `UserSettings_activeFacilityId_fkey`;
ALTER TABLE `FacilitySettings` DROP FOREIGN KEY `FacilitySettings_facilityId_fkey`;
ALTER TABLE `FacilityMembership` DROP FOREIGN KEY `FacilityMembership_userId_fkey`;
ALTER TABLE `FacilityMembership` DROP FOREIGN KEY `FacilityMembership_facilityId_fkey`;
ALTER TABLE `FacilityMembership` DROP FOREIGN KEY `FacilityMembership_approvedByUserId_fkey`;
ALTER TABLE `Patient` DROP FOREIGN KEY `Patient_facilityId_fkey`;
ALTER TABLE `Admission` DROP FOREIGN KEY `Admission_patientId_fkey`;
ALTER TABLE `Admission` DROP FOREIGN KEY `Admission_facilityId_fkey`;
ALTER TABLE `Admission` DROP FOREIGN KEY `Admission_createdByUserId_fkey`;
ALTER TABLE `ClinicalSnapshot` DROP FOREIGN KEY `ClinicalSnapshot_admissionId_fkey`;
ALTER TABLE `ClinicalSnapshot` DROP FOREIGN KEY `ClinicalSnapshot_enteredByUserId_fkey`;
ALTER TABLE `AbgTest` DROP FOREIGN KEY `AbgTest_admissionId_fkey`;
ALTER TABLE `AbgTest` DROP FOREIGN KEY `AbgTest_enteredByUserId_fkey`;
ALTER TABLE `AbgTest` DROP FOREIGN KEY `AbgTest_reviewedByUserId_fkey`;
ALTER TABLE `VentilatorSetting` DROP FOREIGN KEY `VentilatorSetting_admissionId_fkey`;
ALTER TABLE `VentilatorSetting` DROP FOREIGN KEY `VentilatorSetting_enteredByUserId_fkey`;
ALTER TABLE `AirwayDevice` DROP FOREIGN KEY `AirwayDevice_admissionId_fkey`;
ALTER TABLE `AirwayDevice` DROP FOREIGN KEY `AirwayDevice_enteredByUserId_fkey`;
ALTER TABLE `HumidificationDecision` DROP FOREIGN KEY `HumidificationDecision_admissionId_fkey`;
ALTER TABLE `HumidificationDecision` DROP FOREIGN KEY `HumidificationDecision_confirmedByUserId_fkey`;
ALTER TABLE `DailyVentilationReview` DROP FOREIGN KEY `DailyVentilationReview_admissionId_fkey`;
ALTER TABLE `DailyVentilationReview` DROP FOREIGN KEY `DailyVentilationReview_reviewedByUserId_fkey`;
ALTER TABLE `Outcome` DROP FOREIGN KEY `Outcome_admissionId_fkey`;
ALTER TABLE `Outcome` DROP FOREIGN KEY `Outcome_enteredByUserId_fkey`;
ALTER TABLE `ReviewAction` DROP FOREIGN KEY `ReviewAction_facilityId_fkey`;
ALTER TABLE `ReviewAction` DROP FOREIGN KEY `ReviewAction_reviewerUserId_fkey`;
ALTER TABLE `DatasetCase` DROP FOREIGN KEY `DatasetCase_facilityId_fkey`;
ALTER TABLE `DatasetCase` DROP FOREIGN KEY `DatasetCase_sourceAdmissionId_fkey`;
ALTER TABLE `DatasetCase` DROP FOREIGN KEY `DatasetCase_approvedByUserId_fkey`;
ALTER TABLE `DatasetCase` DROP FOREIGN KEY `DatasetCase_reviewedByUserId_fkey`;
ALTER TABLE `ReferenceRule` DROP FOREIGN KEY `ReferenceRule_facilityId_fkey`;
ALTER TABLE `ReferenceRule` DROP FOREIGN KEY `ReferenceRule_approvedByUserId_fkey`;
ALTER TABLE `ReferenceRule` DROP FOREIGN KEY `ReferenceRule_verifiedByUserId_fkey`;
ALTER TABLE `ModelOutput` DROP FOREIGN KEY `ModelOutput_modelVersionId_fkey`;
ALTER TABLE `ModelOutput` DROP FOREIGN KEY `ModelOutput_sourceAdmissionId_fkey`;
ALTER TABLE `IdempotencyRecord` DROP FOREIGN KEY `IdempotencyRecord_userId_fkey`;
ALTER TABLE `IdempotencyRecord` DROP FOREIGN KEY `IdempotencyRecord_facilityId_fkey`;
ALTER TABLE `SyncEvent` DROP FOREIGN KEY `SyncEvent_userId_fkey`;
ALTER TABLE `SyncEvent` DROP FOREIGN KEY `SyncEvent_facilityId_fkey`;
ALTER TABLE `AuditLog` DROP FOREIGN KEY `AuditLog_userId_fkey`;
ALTER TABLE `AuditLog` DROP FOREIGN KEY `AuditLog_facilityId_fkey`;

-- Rename columns to lowercase_snake names while preserving Prisma field names.
ALTER TABLE `User` CHANGE COLUMN `passwordHash` `password_hash` varchar(191) NOT NULL;
ALTER TABLE `User` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `User` CHANGE COLUMN `updatedAt` `updated_at` datetime(3) NOT NULL;
ALTER TABLE `RefreshSession` CHANGE COLUMN `userId` `user_id` varchar(191) NOT NULL;
ALTER TABLE `RefreshSession` CHANGE COLUMN `tokenHash` `token_hash` varchar(191) NOT NULL;
ALTER TABLE `RefreshSession` CHANGE COLUMN `expiresAt` `expires_at` datetime(3) NOT NULL;
ALTER TABLE `RefreshSession` CHANGE COLUMN `revokedAt` `revoked_at` datetime(3) DEFAULT NULL;
ALTER TABLE `RefreshSession` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `RefreshSession` CHANGE COLUMN `updatedAt` `updated_at` datetime(3) NOT NULL;
ALTER TABLE `OnboardingState` CHANGE COLUMN `userId` `user_id` varchar(191) NOT NULL;
ALTER TABLE `OnboardingState` CHANGE COLUMN `currentStep` `current_step` enum('WELCOME','CLINICAL_SAFETY','USER_SETUP','FACILITY_SELECTION','MEMBERSHIP_REQUEST','COMPLETED') NOT NULL DEFAULT 'WELCOME';
ALTER TABLE `OnboardingState` CHANGE COLUMN `completedStepsJson` `completed_steps_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`completed_steps_json`));
ALTER TABLE `OnboardingState` CHANGE COLUMN `selectedFacilityId` `selected_facility_id` varchar(191) DEFAULT NULL;
ALTER TABLE `OnboardingState` CHANGE COLUMN `requestedRole` `requested_role` enum('PLATFORM_ADMIN','FACILITY_ADMIN','CLINICIAN','ICU_NURSE','SPECIALIST_REVIEWER','RESEARCH_GOVERNANCE_OFFICER','MODEL_GOVERNANCE_OFFICER','READ_ONLY_REVIEWER') DEFAULT NULL;
ALTER TABLE `OnboardingState` CHANGE COLUMN `clinicalSafetyAcknowledgedAt` `clinical_safety_acknowledged_at` datetime(3) DEFAULT NULL;
ALTER TABLE `OnboardingState` CHANGE COLUMN `clinicalSafetyAcknowledgementVersion` `clinical_safety_acknowledgement_version` varchar(191) DEFAULT NULL;
ALTER TABLE `OnboardingState` CHANGE COLUMN `clinicalSafetyStatementHash` `clinical_safety_statement_hash` varchar(191) DEFAULT NULL;
ALTER TABLE `OnboardingState` CHANGE COLUMN `completedAt` `completed_at` datetime(3) DEFAULT NULL;
ALTER TABLE `OnboardingState` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `OnboardingState` CHANGE COLUMN `updatedAt` `updated_at` datetime(3) NOT NULL;
ALTER TABLE `Facility` CHANGE COLUMN `registryCode` `registry_code` varchar(191) DEFAULT NULL;
ALTER TABLE `Facility` CHANGE COLUMN `verificationStatus` `verification_status` enum('PENDING','VERIFIED','REJECTED','SUSPENDED') NOT NULL DEFAULT 'PENDING';
ALTER TABLE `Facility` CHANGE COLUMN `oxygenProfileJson` `oxygen_profile_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`oxygen_profile_json`));
ALTER TABLE `Facility` CHANGE COLUMN `ventilatorProfileJson` `ventilator_profile_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ventilator_profile_json`));
ALTER TABLE `Facility` CHANGE COLUMN `abgAvailability` `abg_availability` varchar(191) DEFAULT NULL;
ALTER TABLE `Facility` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `Facility` CHANGE COLUMN `updatedAt` `updated_at` datetime(3) NOT NULL;
ALTER TABLE `UserSettings` CHANGE COLUMN `userId` `user_id` varchar(191) NOT NULL;
ALTER TABLE `UserSettings` CHANGE COLUMN `activeFacilityId` `active_facility_id` varchar(191) DEFAULT NULL;
ALTER TABLE `UserSettings` CHANGE COLUMN `roleVisibilityJson` `role_visibility_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`role_visibility_json`));
ALTER TABLE `UserSettings` CHANGE COLUMN `offlineSyncPreferencesJson` `offline_sync_preferences_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`offline_sync_preferences_json`));
ALTER TABLE `UserSettings` CHANGE COLUMN `privacyControlsJson` `privacy_controls_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`privacy_controls_json`));
ALTER TABLE `UserSettings` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `UserSettings` CHANGE COLUMN `updatedAt` `updated_at` datetime(3) NOT NULL;
ALTER TABLE `FacilitySettings` CHANGE COLUMN `facilityId` `facility_id` varchar(191) NOT NULL;
ALTER TABLE `FacilitySettings` CHANGE COLUMN `referenceSettingsJson` `reference_settings_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`reference_settings_json`));
ALTER TABLE `FacilitySettings` CHANGE COLUMN `workflowSettingsJson` `workflow_settings_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`workflow_settings_json`));
ALTER TABLE `FacilitySettings` CHANGE COLUMN `privacyControlsJson` `privacy_controls_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`privacy_controls_json`));
ALTER TABLE `FacilitySettings` CHANGE COLUMN `governanceSettingsJson` `governance_settings_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`governance_settings_json`));
ALTER TABLE `FacilitySettings` CHANGE COLUMN `modelVisibilityJson` `model_visibility_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`model_visibility_json`));
ALTER TABLE `FacilitySettings` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `FacilitySettings` CHANGE COLUMN `updatedAt` `updated_at` datetime(3) NOT NULL;
ALTER TABLE `FacilityMembership` CHANGE COLUMN `userId` `user_id` varchar(191) NOT NULL;
ALTER TABLE `FacilityMembership` CHANGE COLUMN `facilityId` `facility_id` varchar(191) NOT NULL;
ALTER TABLE `FacilityMembership` CHANGE COLUMN `approvedByUserId` `approved_by_user_id` varchar(191) DEFAULT NULL;
ALTER TABLE `FacilityMembership` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `FacilityMembership` CHANGE COLUMN `updatedAt` `updated_at` datetime(3) NOT NULL;
ALTER TABLE `Patient` CHANGE COLUMN `facilityId` `facility_id` varchar(191) NOT NULL;
ALTER TABLE `Patient` CHANGE COLUMN `appPatientCode` `app_patient_code` varchar(191) NOT NULL;
ALTER TABLE `Patient` CHANGE COLUMN `optionalName` `optional_name` varchar(191) DEFAULT NULL;
ALTER TABLE `Patient` CHANGE COLUMN `hospitalNumber` `hospital_number` varchar(191) DEFAULT NULL;
ALTER TABLE `Patient` CHANGE COLUMN `patientPathway` `patient_pathway` enum('NEONATE','INFANT','CHILD','ADOLESCENT','ADULT','OBSTETRIC','BURNS','TRAUMA','PERI_OPERATIVE','MEDICAL','SURGICAL','UNKNOWN','OTHER') NOT NULL;
ALTER TABLE `Patient` CHANGE COLUMN `dateOfBirth` `date_of_birth` datetime(3) DEFAULT NULL;
ALTER TABLE `Patient` CHANGE COLUMN `ageYears` `age_years` int(11) DEFAULT NULL;
ALTER TABLE `Patient` CHANGE COLUMN `ageMonths` `age_months` int(11) DEFAULT NULL;
ALTER TABLE `Patient` CHANGE COLUMN `estimatedAge` `estimated_age` tinyint(1) NOT NULL DEFAULT 0;
ALTER TABLE `Patient` CHANGE COLUMN `gestationalAgeWeeks` `gestational_age_weeks` double DEFAULT NULL;
ALTER TABLE `Patient` CHANGE COLUMN `correctedAgeWeeks` `corrected_age_weeks` double DEFAULT NULL;
ALTER TABLE `Patient` CHANGE COLUMN `sexForSizeCalculations` `sex_for_size_calculations` enum('MALE','FEMALE','UNKNOWN') NOT NULL DEFAULT 'UNKNOWN';
ALTER TABLE `Patient` CHANGE COLUMN `actualWeightKg` `actual_weight_kg` double DEFAULT NULL;
ALTER TABLE `Patient` CHANGE COLUMN `heightOrLengthCm` `height_or_length_cm` double DEFAULT NULL;
ALTER TABLE `Patient` CHANGE COLUMN `referenceWeightKg` `reference_weight_kg` double DEFAULT NULL;
ALTER TABLE `Patient` CHANGE COLUMN `referenceWeightMethod` `reference_weight_method` varchar(191) DEFAULT NULL;
ALTER TABLE `Patient` CHANGE COLUMN `pathwayDetailsJson` `pathway_details_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`pathway_details_json`));
ALTER TABLE `Patient` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `Patient` CHANGE COLUMN `updatedAt` `updated_at` datetime(3) NOT NULL;
ALTER TABLE `Admission` CHANGE COLUMN `patientId` `patient_id` varchar(191) NOT NULL;
ALTER TABLE `Admission` CHANGE COLUMN `facilityId` `facility_id` varchar(191) NOT NULL;
ALTER TABLE `Admission` CHANGE COLUMN `appAdmissionCode` `app_admission_code` varchar(191) NOT NULL;
ALTER TABLE `Admission` CHANGE COLUMN `bedNumber` `bed_number` varchar(191) DEFAULT NULL;
ALTER TABLE `Admission` CHANGE COLUMN `admittedAt` `admitted_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `Admission` CHANGE COLUMN `admissionSource` `admission_source` varchar(191) DEFAULT NULL;
ALTER TABLE `Admission` CHANGE COLUMN `reasonForVentilation` `reason_for_ventilation` varchar(191) DEFAULT NULL;
ALTER TABLE `Admission` CHANGE COLUMN `createdByUserId` `created_by_user_id` varchar(191) DEFAULT NULL;
ALTER TABLE `Admission` CHANGE COLUMN `reviewStatus` `review_status` enum('PENDING','APPROVED','CORRECTION_REQUESTED','EXCLUDED') NOT NULL DEFAULT 'PENDING';
ALTER TABLE `Admission` CHANGE COLUMN `clientRecordId` `client_record_id` varchar(191) DEFAULT NULL;
ALTER TABLE `Admission` CHANGE COLUMN `deviceId` `device_id` varchar(191) DEFAULT NULL;
ALTER TABLE `Admission` CHANGE COLUMN `clientCreatedAt` `client_created_at` datetime(3) DEFAULT NULL;
ALTER TABLE `Admission` CHANGE COLUMN `clientUpdatedAt` `client_updated_at` datetime(3) DEFAULT NULL;
ALTER TABLE `Admission` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `Admission` CHANGE COLUMN `updatedAt` `updated_at` datetime(3) NOT NULL;
ALTER TABLE `ClinicalSnapshot` CHANGE COLUMN `admissionId` `admission_id` varchar(191) NOT NULL;
ALTER TABLE `ClinicalSnapshot` CHANGE COLUMN `measuredAt` `measured_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `ClinicalSnapshot` CHANGE COLUMN `oxygenSupportType` `oxygen_support_type` varchar(191) DEFAULT NULL;
ALTER TABLE `ClinicalSnapshot` CHANGE COLUMN `heartRate` `heart_rate` double DEFAULT NULL;
ALTER TABLE `ClinicalSnapshot` CHANGE COLUMN `respiratoryRate` `respiratory_rate` double DEFAULT NULL;
ALTER TABLE `ClinicalSnapshot` CHANGE COLUMN `systolicBp` `systolic_bp` double DEFAULT NULL;
ALTER TABLE `ClinicalSnapshot` CHANGE COLUMN `diastolicBp` `diastolic_bp` double DEFAULT NULL;
ALTER TABLE `ClinicalSnapshot` CHANGE COLUMN `meanArterialPressure` `mean_arterial_pressure` double DEFAULT NULL;
ALTER TABLE `ClinicalSnapshot` CHANGE COLUMN `temperatureC` `temperature_c` double DEFAULT NULL;
ALTER TABLE `ClinicalSnapshot` CHANGE COLUMN `mainCondition` `main_condition` varchar(191) DEFAULT NULL;
ALTER TABLE `ClinicalSnapshot` CHANGE COLUMN `comorbiditiesJson` `comorbidities_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`comorbidities_json`));
ALTER TABLE `ClinicalSnapshot` CHANGE COLUMN `validationStatus` `validation_status` varchar(191) DEFAULT NULL;
ALTER TABLE `ClinicalSnapshot` CHANGE COLUMN `enteredByUserId` `entered_by_user_id` varchar(191) DEFAULT NULL;
ALTER TABLE `ClinicalSnapshot` CHANGE COLUMN `clientRecordId` `client_record_id` varchar(191) DEFAULT NULL;
ALTER TABLE `ClinicalSnapshot` CHANGE COLUMN `deviceId` `device_id` varchar(191) DEFAULT NULL;
ALTER TABLE `ClinicalSnapshot` CHANGE COLUMN `clientCreatedAt` `client_created_at` datetime(3) DEFAULT NULL;
ALTER TABLE `ClinicalSnapshot` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `AbgTest` CHANGE COLUMN `admissionId` `admission_id` varchar(191) NOT NULL;
ALTER TABLE `AbgTest` CHANGE COLUMN `collectedAt` `collected_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `AbgTest` CHANGE COLUMN `baseExcess` `base_excess` double DEFAULT NULL;
ALTER TABLE `AbgTest` CHANGE COLUMN `fio2AtSample` `fio2_at_sample` double DEFAULT NULL;
ALTER TABLE `AbgTest` CHANGE COLUMN `spo2AtSample` `spo2_at_sample` double DEFAULT NULL;
ALTER TABLE `AbgTest` CHANGE COLUMN `validationStatus` `validation_status` varchar(191) DEFAULT NULL;
ALTER TABLE `AbgTest` CHANGE COLUMN `clinicalFlagsJson` `clinical_flags_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`clinical_flags_json`));
ALTER TABLE `AbgTest` CHANGE COLUMN `calculationSummaryJson` `calculation_summary_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`calculation_summary_json`));
ALTER TABLE `AbgTest` CHANGE COLUMN `enteredByUserId` `entered_by_user_id` varchar(191) DEFAULT NULL;
ALTER TABLE `AbgTest` CHANGE COLUMN `reviewedByUserId` `reviewed_by_user_id` varchar(191) DEFAULT NULL;
ALTER TABLE `AbgTest` CHANGE COLUMN `reviewStatus` `review_status` enum('PENDING','APPROVED','CORRECTION_REQUESTED','EXCLUDED') NOT NULL DEFAULT 'PENDING';
ALTER TABLE `AbgTest` CHANGE COLUMN `clientRecordId` `client_record_id` varchar(191) DEFAULT NULL;
ALTER TABLE `AbgTest` CHANGE COLUMN `deviceId` `device_id` varchar(191) DEFAULT NULL;
ALTER TABLE `AbgTest` CHANGE COLUMN `clientCreatedAt` `client_created_at` datetime(3) DEFAULT NULL;
ALTER TABLE `AbgTest` CHANGE COLUMN `clientUpdatedAt` `client_updated_at` datetime(3) DEFAULT NULL;
ALTER TABLE `AbgTest` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `VentilatorSetting` CHANGE COLUMN `admissionId` `admission_id` varchar(191) NOT NULL;
ALTER TABLE `VentilatorSetting` CHANGE COLUMN `measuredAt` `measured_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `VentilatorSetting` CHANGE COLUMN `tidalVolumeMl` `tidal_volume_ml` double DEFAULT NULL;
ALTER TABLE `VentilatorSetting` CHANGE COLUMN `respiratoryRateSet` `respiratory_rate_set` double DEFAULT NULL;
ALTER TABLE `VentilatorSetting` CHANGE COLUMN `respiratoryRateMeasured` `respiratory_rate_measured` double DEFAULT NULL;
ALTER TABLE `VentilatorSetting` CHANGE COLUMN `pressureSupport` `pressure_support` double DEFAULT NULL;
ALTER TABLE `VentilatorSetting` CHANGE COLUMN `inspiratoryPressure` `inspiratory_pressure` double DEFAULT NULL;
ALTER TABLE `VentilatorSetting` CHANGE COLUMN `peakPressure` `peak_pressure` double DEFAULT NULL;
ALTER TABLE `VentilatorSetting` CHANGE COLUMN `plateauPressure` `plateau_pressure` double DEFAULT NULL;
ALTER TABLE `VentilatorSetting` CHANGE COLUMN `ieRatio` `ie_ratio` varchar(191) DEFAULT NULL;
ALTER TABLE `VentilatorSetting` CHANGE COLUMN `minuteVolumeLMin` `minute_volume_l_min` double DEFAULT NULL;
ALTER TABLE `VentilatorSetting` CHANGE COLUMN `vtMlPerKgReferenceWeight` `vt_ml_per_kg_reference_weight` double DEFAULT NULL;
ALTER TABLE `VentilatorSetting` CHANGE COLUMN `drivingPressure` `driving_pressure` double DEFAULT NULL;
ALTER TABLE `VentilatorSetting` CHANGE COLUMN `validationStatus` `validation_status` varchar(191) DEFAULT NULL;
ALTER TABLE `VentilatorSetting` CHANGE COLUMN `clinicalFlagsJson` `clinical_flags_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`clinical_flags_json`));
ALTER TABLE `VentilatorSetting` CHANGE COLUMN `calculationSummaryJson` `calculation_summary_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`calculation_summary_json`));
ALTER TABLE `VentilatorSetting` CHANGE COLUMN `enteredByUserId` `entered_by_user_id` varchar(191) DEFAULT NULL;
ALTER TABLE `VentilatorSetting` CHANGE COLUMN `reviewStatus` `review_status` enum('PENDING','APPROVED','CORRECTION_REQUESTED','EXCLUDED') NOT NULL DEFAULT 'PENDING';
ALTER TABLE `VentilatorSetting` CHANGE COLUMN `clientRecordId` `client_record_id` varchar(191) DEFAULT NULL;
ALTER TABLE `VentilatorSetting` CHANGE COLUMN `deviceId` `device_id` varchar(191) DEFAULT NULL;
ALTER TABLE `VentilatorSetting` CHANGE COLUMN `clientCreatedAt` `client_created_at` datetime(3) DEFAULT NULL;
ALTER TABLE `VentilatorSetting` CHANGE COLUMN `clientUpdatedAt` `client_updated_at` datetime(3) DEFAULT NULL;
ALTER TABLE `VentilatorSetting` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `AirwayDevice` CHANGE COLUMN `admissionId` `admission_id` varchar(191) NOT NULL;
ALTER TABLE `AirwayDevice` CHANGE COLUMN `measuredAt` `measured_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `AirwayDevice` CHANGE COLUMN `airwayRoute` `airway_route` varchar(191) DEFAULT NULL;
ALTER TABLE `AirwayDevice` CHANGE COLUMN `tubeType` `tube_type` varchar(191) DEFAULT NULL;
ALTER TABLE `AirwayDevice` CHANGE COLUMN `internalDiameterMm` `internal_diameter_mm` double DEFAULT NULL;
ALTER TABLE `AirwayDevice` CHANGE COLUMN `depthCm` `depth_cm` double DEFAULT NULL;
ALTER TABLE `AirwayDevice` CHANGE COLUMN `cuffPressureCmH2O` `cuff_pressure_cm_h2o` double DEFAULT NULL;
ALTER TABLE `AirwayDevice` CHANGE COLUMN `tubeSecured` `tube_secured` tinyint(1) DEFAULT NULL;
ALTER TABLE `AirwayDevice` CHANGE COLUMN `validationStatus` `validation_status` varchar(191) DEFAULT NULL;
ALTER TABLE `AirwayDevice` CHANGE COLUMN `clinicalFlagsJson` `clinical_flags_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`clinical_flags_json`));
ALTER TABLE `AirwayDevice` CHANGE COLUMN `enteredByUserId` `entered_by_user_id` varchar(191) DEFAULT NULL;
ALTER TABLE `AirwayDevice` CHANGE COLUMN `clientRecordId` `client_record_id` varchar(191) DEFAULT NULL;
ALTER TABLE `AirwayDevice` CHANGE COLUMN `deviceId` `device_id` varchar(191) DEFAULT NULL;
ALTER TABLE `AirwayDevice` CHANGE COLUMN `clientCreatedAt` `client_created_at` datetime(3) DEFAULT NULL;
ALTER TABLE `AirwayDevice` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `HumidificationDecision` CHANGE COLUMN `admissionId` `admission_id` varchar(191) NOT NULL;
ALTER TABLE `HumidificationDecision` CHANGE COLUMN `measuredAt` `measured_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `HumidificationDecision` CHANGE COLUMN `thickSecretions` `thick_secretions` tinyint(1) DEFAULT NULL;
ALTER TABLE `HumidificationDecision` CHANGE COLUMN `highMinuteVentilation` `high_minute_ventilation` tinyint(1) DEFAULT NULL;
ALTER TABLE `HumidificationDecision` CHANGE COLUMN `airwayBleeding` `airway_bleeding` tinyint(1) DEFAULT NULL;
ALTER TABLE `HumidificationDecision` CHANGE COLUMN `expectedLongVentilation` `expected_long_ventilation` tinyint(1) DEFAULT NULL;
ALTER TABLE `HumidificationDecision` CHANGE COLUMN `suggestedOption` `suggested_option` varchar(191) DEFAULT NULL;
ALTER TABLE `HumidificationDecision` CHANGE COLUMN `confirmedOption` `confirmed_option` varchar(191) DEFAULT NULL;
ALTER TABLE `HumidificationDecision` CHANGE COLUMN `clinicalFlagsJson` `clinical_flags_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`clinical_flags_json`));
ALTER TABLE `HumidificationDecision` CHANGE COLUMN `confirmedByUserId` `confirmed_by_user_id` varchar(191) DEFAULT NULL;
ALTER TABLE `HumidificationDecision` CHANGE COLUMN `clientRecordId` `client_record_id` varchar(191) DEFAULT NULL;
ALTER TABLE `HumidificationDecision` CHANGE COLUMN `deviceId` `device_id` varchar(191) DEFAULT NULL;
ALTER TABLE `HumidificationDecision` CHANGE COLUMN `clientCreatedAt` `client_created_at` datetime(3) DEFAULT NULL;
ALTER TABLE `HumidificationDecision` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `DailyVentilationReview` CHANGE COLUMN `admissionId` `admission_id` varchar(191) NOT NULL;
ALTER TABLE `DailyVentilationReview` CHANGE COLUMN `reviewDate` `review_date` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `DailyVentilationReview` CHANGE COLUMN `oxygenationStable` `oxygenation_stable` tinyint(1) DEFAULT NULL;
ALTER TABLE `DailyVentilationReview` CHANGE COLUMN `hemodynamicsStable` `hemodynamics_stable` tinyint(1) DEFAULT NULL;
ALTER TABLE `DailyVentilationReview` CHANGE COLUMN `sedationLightEnough` `sedation_light_enough` tinyint(1) DEFAULT NULL;
ALTER TABLE `DailyVentilationReview` CHANGE COLUMN `secretionsManageable` `secretions_manageable` tinyint(1) DEFAULT NULL;
ALTER TABLE `DailyVentilationReview` CHANGE COLUMN `sbtStatus` `sbt_status` varchar(191) DEFAULT NULL;
ALTER TABLE `DailyVentilationReview` CHANGE COLUMN `sbtFailureReason` `sbt_failure_reason` varchar(191) DEFAULT NULL;
ALTER TABLE `DailyVentilationReview` CHANGE COLUMN `proneStatus` `prone_status` varchar(191) DEFAULT NULL;
ALTER TABLE `DailyVentilationReview` CHANGE COLUMN `vapBundleJson` `vap_bundle_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`vap_bundle_json`));
ALTER TABLE `DailyVentilationReview` CHANGE COLUMN `clinicalFlagsJson` `clinical_flags_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`clinical_flags_json`));
ALTER TABLE `DailyVentilationReview` CHANGE COLUMN `reviewedByUserId` `reviewed_by_user_id` varchar(191) DEFAULT NULL;
ALTER TABLE `DailyVentilationReview` CHANGE COLUMN `clientRecordId` `client_record_id` varchar(191) DEFAULT NULL;
ALTER TABLE `DailyVentilationReview` CHANGE COLUMN `deviceId` `device_id` varchar(191) DEFAULT NULL;
ALTER TABLE `DailyVentilationReview` CHANGE COLUMN `clientCreatedAt` `client_created_at` datetime(3) DEFAULT NULL;
ALTER TABLE `DailyVentilationReview` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `Outcome` CHANGE COLUMN `admissionId` `admission_id` varchar(191) NOT NULL;
ALTER TABLE `Outcome` CHANGE COLUMN `outcomeType` `outcome_type` enum('EXTUBATED','TRANSFERRED','DISCHARGED','DECEASED','STILL_ADMITTED','OTHER') NOT NULL;
ALTER TABLE `Outcome` CHANGE COLUMN `outcomeDate` `outcome_date` datetime(3) DEFAULT NULL;
ALTER TABLE `Outcome` CHANGE COLUMN `ventilatorDays` `ventilator_days` double DEFAULT NULL;
ALTER TABLE `Outcome` CHANGE COLUMN `icuLengthOfStayDays` `icu_length_of_stay_days` double DEFAULT NULL;
ALTER TABLE `Outcome` CHANGE COLUMN `hospitalLengthOfStayDays` `hospital_length_of_stay_days` double DEFAULT NULL;
ALTER TABLE `Outcome` CHANGE COLUMN `reintubationWithin48h` `reintubation_within_48h` tinyint(1) DEFAULT NULL;
ALTER TABLE `Outcome` CHANGE COLUMN `vapSuspected` `vap_suspected` tinyint(1) DEFAULT NULL;
ALTER TABLE `Outcome` CHANGE COLUMN `enteredByUserId` `entered_by_user_id` varchar(191) DEFAULT NULL;
ALTER TABLE `Outcome` CHANGE COLUMN `clientRecordId` `client_record_id` varchar(191) DEFAULT NULL;
ALTER TABLE `Outcome` CHANGE COLUMN `deviceId` `device_id` varchar(191) DEFAULT NULL;
ALTER TABLE `Outcome` CHANGE COLUMN `clientCreatedAt` `client_created_at` datetime(3) DEFAULT NULL;
ALTER TABLE `Outcome` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `ReviewAction` CHANGE COLUMN `facilityId` `facility_id` varchar(191) DEFAULT NULL;
ALTER TABLE `ReviewAction` CHANGE COLUMN `reviewerUserId` `reviewer_user_id` varchar(191) DEFAULT NULL;
ALTER TABLE `ReviewAction` CHANGE COLUMN `entityType` `entity_type` varchar(191) NOT NULL;
ALTER TABLE `ReviewAction` CHANGE COLUMN `entityId` `entity_id` varchar(191) NOT NULL;
ALTER TABLE `ReviewAction` CHANGE COLUMN `statusBefore` `status_before` varchar(191) DEFAULT NULL;
ALTER TABLE `ReviewAction` CHANGE COLUMN `statusAfter` `status_after` varchar(191) DEFAULT NULL;
ALTER TABLE `ReviewAction` CHANGE COLUMN `validationStatus` `validation_status` varchar(191) DEFAULT NULL;
ALTER TABLE `ReviewAction` CHANGE COLUMN `triagePriority` `triage_priority` varchar(191) DEFAULT NULL;
ALTER TABLE `ReviewAction` CHANGE COLUMN `overrideReason` `override_reason` text DEFAULT NULL;
ALTER TABLE `ReviewAction` CHANGE COLUMN `correctionJson` `correction_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`correction_json`));
ALTER TABLE `ReviewAction` CHANGE COLUMN `returnedToClinician` `returned_to_clinician` tinyint(1) NOT NULL DEFAULT 0;
ALTER TABLE `ReviewAction` CHANGE COLUMN `beforeJson` `before_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`before_json`));
ALTER TABLE `ReviewAction` CHANGE COLUMN `afterJson` `after_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`after_json`));
ALTER TABLE `ReviewAction` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `DatasetCase` CHANGE COLUMN `facilityId` `facility_id` varchar(191) NOT NULL;
ALTER TABLE `DatasetCase` CHANGE COLUMN `sourceAdmissionId` `source_admission_id` varchar(191) DEFAULT NULL;
ALTER TABLE `DatasetCase` CHANGE COLUMN `sourceType` `source_type` varchar(191) NOT NULL;
ALTER TABLE `DatasetCase` CHANGE COLUMN `sourcePayloadJson` `source_payload_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`source_payload_json`));
ALTER TABLE `DatasetCase` CHANGE COLUMN `structuredPreviewJson` `structured_preview_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`structured_preview_json`));
ALTER TABLE `DatasetCase` CHANGE COLUMN `deidentifiedPayloadJson` `deidentified_payload_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`deidentified_payload_json`));
ALTER TABLE `DatasetCase` CHANGE COLUMN `deidentificationStatus` `deidentification_status` varchar(191) DEFAULT NULL;
ALTER TABLE `DatasetCase` CHANGE COLUMN `reviewStatus` `review_status` enum('DRAFT','SUBMITTED','NEEDS_CORRECTION','REVIEWED','APPROVED_FOR_DATASET','APPROVED_FOR_TRAINING','EXCLUDED') NOT NULL DEFAULT 'SUBMITTED';
ALTER TABLE `DatasetCase` CHANGE COLUMN `approvedForTraining` `approved_for_training` tinyint(1) NOT NULL DEFAULT 0;
ALTER TABLE `DatasetCase` CHANGE COLUMN `approvedByUserId` `approved_by_user_id` varchar(191) DEFAULT NULL;
ALTER TABLE `DatasetCase` CHANGE COLUMN `reviewedByUserId` `reviewed_by_user_id` varchar(191) DEFAULT NULL;
ALTER TABLE `DatasetCase` CHANGE COLUMN `reviewedAt` `reviewed_at` datetime(3) DEFAULT NULL;
ALTER TABLE `DatasetCase` CHANGE COLUMN `ethicsApprovalId` `ethics_approval_id` varchar(191) DEFAULT NULL;
ALTER TABLE `DatasetCase` CHANGE COLUMN `governanceJson` `governance_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`governance_json`));
ALTER TABLE `DatasetCase` CHANGE COLUMN `datasetVersion` `dataset_version` varchar(191) DEFAULT NULL;
ALTER TABLE `DatasetCase` CHANGE COLUMN `exclusionReason` `exclusion_reason` text DEFAULT NULL;
ALTER TABLE `DatasetCase` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `DatasetCase` CHANGE COLUMN `updatedAt` `updated_at` datetime(3) NOT NULL;
ALTER TABLE `ReferenceRule` CHANGE COLUMN `facilityId` `facility_id` varchar(191) DEFAULT NULL;
ALTER TABLE `ReferenceRule` CHANGE COLUMN `clinicalCondition` `clinical_condition` varchar(191) DEFAULT NULL;
ALTER TABLE `ReferenceRule` CHANGE COLUMN `patientPathway` `patient_pathway` enum('NEONATE','INFANT','CHILD','ADOLESCENT','ADULT','OBSTETRIC','BURNS','TRAUMA','PERI_OPERATIVE','MEDICAL','SURGICAL','UNKNOWN','OTHER') DEFAULT NULL;
ALTER TABLE `ReferenceRule` CHANGE COLUMN `parameterName` `parameter_name` varchar(191) DEFAULT NULL;
ALTER TABLE `ReferenceRule` CHANGE COLUMN `lowerBound` `lower_bound` double DEFAULT NULL;
ALTER TABLE `ReferenceRule` CHANGE COLUMN `upperBound` `upper_bound` double DEFAULT NULL;
ALTER TABLE `ReferenceRule` CHANGE COLUMN `sourceCitation` `source_citation` text DEFAULT NULL;
ALTER TABLE `ReferenceRule` CHANGE COLUMN `ruleJson` `rule_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`rule_json`));
ALTER TABLE `ReferenceRule` CHANGE COLUMN `activeFrom` `active_from` datetime(3) DEFAULT NULL;
ALTER TABLE `ReferenceRule` CHANGE COLUMN `activeTo` `active_to` datetime(3) DEFAULT NULL;
ALTER TABLE `ReferenceRule` CHANGE COLUMN `approvedByUserId` `approved_by_user_id` varchar(191) DEFAULT NULL;
ALTER TABLE `ReferenceRule` CHANGE COLUMN `verifiedByUserId` `verified_by_user_id` varchar(191) DEFAULT NULL;
ALTER TABLE `ReferenceRule` CHANGE COLUMN `verifiedAt` `verified_at` datetime(3) DEFAULT NULL;
ALTER TABLE `ReferenceRule` CHANGE COLUMN `verificationStatus` `verification_status` enum('DRAFT','PENDING_REVIEW','VERIFIED','CORRECTION_REQUESTED','REJECTED','RETIRED') NOT NULL DEFAULT 'PENDING_REVIEW';
ALTER TABLE `ReferenceRule` CHANGE COLUMN `reviewNotes` `review_notes` text DEFAULT NULL;
ALTER TABLE `ReferenceRule` CHANGE COLUMN `auditTrailJson` `audit_trail_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`audit_trail_json`));
ALTER TABLE `ReferenceRule` CHANGE COLUMN `governanceStatus` `governance_status` varchar(191) DEFAULT NULL;
ALTER TABLE `ReferenceRule` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `ReferenceRule` CHANGE COLUMN `updatedAt` `updated_at` datetime(3) NOT NULL;
ALTER TABLE `ModelVersion` CHANGE COLUMN `modelName` `model_name` varchar(191) NOT NULL;
ALTER TABLE `ModelVersion` CHANGE COLUMN `trainingDatasetVersion` `training_dataset_version` varchar(191) DEFAULT NULL;
ALTER TABLE `ModelVersion` CHANGE COLUMN `intendedUse` `intended_use` text DEFAULT NULL;
ALTER TABLE `ModelVersion` CHANGE COLUMN `contraindicatedUse` `contraindicated_use` text DEFAULT NULL;
ALTER TABLE `ModelVersion` CHANGE COLUMN `performanceSummaryJson` `performance_summary_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`performance_summary_json`));
ALTER TABLE `ModelVersion` CHANGE COLUMN `calibrationSummaryJson` `calibration_summary_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`calibration_summary_json`));
ALTER TABLE `ModelVersion` CHANGE COLUMN `biasAssessmentJson` `bias_assessment_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`bias_assessment_json`));
ALTER TABLE `ModelVersion` CHANGE COLUMN `approvalStatus` `approval_status` enum('DRAFT','SHADOW_MODE','APPROVED_FOR_LIVE_SUPPORT','RETIRED') NOT NULL DEFAULT 'DRAFT';
ALTER TABLE `ModelVersion` CHANGE COLUMN `activatedAt` `activated_at` datetime(3) DEFAULT NULL;
ALTER TABLE `ModelVersion` CHANGE COLUMN `retiredAt` `retired_at` datetime(3) DEFAULT NULL;
ALTER TABLE `ModelVersion` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `ModelVersion` CHANGE COLUMN `updatedAt` `updated_at` datetime(3) NOT NULL;
ALTER TABLE `ModelOutput` CHANGE COLUMN `modelVersionId` `model_version_id` varchar(191) NOT NULL;
ALTER TABLE `ModelOutput` CHANGE COLUMN `facilityId` `facility_id` varchar(191) DEFAULT NULL;
ALTER TABLE `ModelOutput` CHANGE COLUMN `sourceAdmissionId` `source_admission_id` varchar(191) DEFAULT NULL;
ALTER TABLE `ModelOutput` CHANGE COLUMN `inputSummaryJson` `input_summary_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`input_summary_json`));
ALTER TABLE `ModelOutput` CHANGE COLUMN `outputJson` `output_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`output_json`));
ALTER TABLE `ModelOutput` CHANGE COLUMN `visibleToClinicians` `visible_to_clinicians` tinyint(1) NOT NULL DEFAULT 0;
ALTER TABLE `ModelOutput` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `IdempotencyRecord` CHANGE COLUMN `userId` `user_id` varchar(191) DEFAULT NULL;
ALTER TABLE `IdempotencyRecord` CHANGE COLUMN `facilityId` `facility_id` varchar(191) DEFAULT NULL;
ALTER TABLE `IdempotencyRecord` CHANGE COLUMN `requestHash` `request_hash` varchar(191) NOT NULL;
ALTER TABLE `IdempotencyRecord` CHANGE COLUMN `responseJson` `response_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`response_json`));
ALTER TABLE `IdempotencyRecord` CHANGE COLUMN `entityType` `entity_type` varchar(191) DEFAULT NULL;
ALTER TABLE `IdempotencyRecord` CHANGE COLUMN `entityId` `entity_id` varchar(191) DEFAULT NULL;
ALTER TABLE `IdempotencyRecord` CHANGE COLUMN `clientRecordId` `client_record_id` varchar(191) DEFAULT NULL;
ALTER TABLE `IdempotencyRecord` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `IdempotencyRecord` CHANGE COLUMN `updatedAt` `updated_at` datetime(3) NOT NULL;
ALTER TABLE `SyncEvent` CHANGE COLUMN `userId` `user_id` varchar(191) DEFAULT NULL;
ALTER TABLE `SyncEvent` CHANGE COLUMN `facilityId` `facility_id` varchar(191) DEFAULT NULL;
ALTER TABLE `SyncEvent` CHANGE COLUMN `entityType` `entity_type` varchar(191) DEFAULT NULL;
ALTER TABLE `SyncEvent` CHANGE COLUMN `entityId` `entity_id` varchar(191) DEFAULT NULL;
ALTER TABLE `SyncEvent` CHANGE COLUMN `clientRecordId` `client_record_id` varchar(191) DEFAULT NULL;
ALTER TABLE `SyncEvent` CHANGE COLUMN `idempotencyKey` `idempotency_key` varchar(191) DEFAULT NULL;
ALTER TABLE `SyncEvent` CHANGE COLUMN `requestPayloadJson` `request_payload_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`request_payload_json`));
ALTER TABLE `SyncEvent` CHANGE COLUMN `responsePayloadJson` `response_payload_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`response_payload_json`));
ALTER TABLE `SyncEvent` CHANGE COLUMN `conflictPayloadJson` `conflict_payload_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`conflict_payload_json`));
ALTER TABLE `SyncEvent` CHANGE COLUMN `errorMessage` `error_message` text DEFAULT NULL;
ALTER TABLE `SyncEvent` CHANGE COLUMN `clientCreatedAt` `client_created_at` datetime(3) DEFAULT NULL;
ALTER TABLE `SyncEvent` CHANGE COLUMN `clientUpdatedAt` `client_updated_at` datetime(3) DEFAULT NULL;
ALTER TABLE `SyncEvent` CHANGE COLUMN `deviceId` `device_id` varchar(191) DEFAULT NULL;
ALTER TABLE `SyncEvent` CHANGE COLUMN `receivedAt` `received_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `SyncEvent` CHANGE COLUMN `resolvedAt` `resolved_at` datetime(3) DEFAULT NULL;
ALTER TABLE `SyncEvent` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE `SyncEvent` CHANGE COLUMN `updatedAt` `updated_at` datetime(3) NOT NULL;
ALTER TABLE `AuditLog` CHANGE COLUMN `userId` `user_id` varchar(191) DEFAULT NULL;
ALTER TABLE `AuditLog` CHANGE COLUMN `facilityId` `facility_id` varchar(191) DEFAULT NULL;
ALTER TABLE `AuditLog` CHANGE COLUMN `entityType` `entity_type` varchar(191) NOT NULL;
ALTER TABLE `AuditLog` CHANGE COLUMN `entityId` `entity_id` varchar(191) DEFAULT NULL;
ALTER TABLE `AuditLog` CHANGE COLUMN `beforeJson` `before_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`before_json`));
ALTER TABLE `AuditLog` CHANGE COLUMN `afterJson` `after_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`after_json`));
ALTER TABLE `AuditLog` CHANGE COLUMN `requestId` `request_id` varchar(191) DEFAULT NULL;
ALTER TABLE `AuditLog` CHANGE COLUMN `ipHash` `ip_hash` varchar(191) DEFAULT NULL;
ALTER TABLE `AuditLog` CHANGE COLUMN `createdAt` `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3);

-- Rename tables to lowercase_snake names.
RENAME TABLE `User` TO `_snake_rename_user`;
RENAME TABLE `_snake_rename_user` TO `user`;
RENAME TABLE `RefreshSession` TO `_snake_rename_refresh_session`;
RENAME TABLE `_snake_rename_refresh_session` TO `refresh_session`;
RENAME TABLE `OnboardingState` TO `_snake_rename_onboarding_state`;
RENAME TABLE `_snake_rename_onboarding_state` TO `onboarding_state`;
RENAME TABLE `Facility` TO `_snake_rename_facility`;
RENAME TABLE `_snake_rename_facility` TO `facility`;
RENAME TABLE `UserSettings` TO `_snake_rename_user_settings`;
RENAME TABLE `_snake_rename_user_settings` TO `user_settings`;
RENAME TABLE `FacilitySettings` TO `_snake_rename_facility_settings`;
RENAME TABLE `_snake_rename_facility_settings` TO `facility_settings`;
RENAME TABLE `FacilityMembership` TO `_snake_rename_facility_membership`;
RENAME TABLE `_snake_rename_facility_membership` TO `facility_membership`;
RENAME TABLE `Patient` TO `_snake_rename_patient`;
RENAME TABLE `_snake_rename_patient` TO `patient`;
RENAME TABLE `Admission` TO `_snake_rename_admission`;
RENAME TABLE `_snake_rename_admission` TO `admission`;
RENAME TABLE `ClinicalSnapshot` TO `_snake_rename_clinical_snapshot`;
RENAME TABLE `_snake_rename_clinical_snapshot` TO `clinical_snapshot`;
RENAME TABLE `AbgTest` TO `_snake_rename_abg_test`;
RENAME TABLE `_snake_rename_abg_test` TO `abg_test`;
RENAME TABLE `VentilatorSetting` TO `_snake_rename_ventilator_setting`;
RENAME TABLE `_snake_rename_ventilator_setting` TO `ventilator_setting`;
RENAME TABLE `AirwayDevice` TO `_snake_rename_airway_device`;
RENAME TABLE `_snake_rename_airway_device` TO `airway_device`;
RENAME TABLE `HumidificationDecision` TO `_snake_rename_humidification_decision`;
RENAME TABLE `_snake_rename_humidification_decision` TO `humidification_decision`;
RENAME TABLE `DailyVentilationReview` TO `_snake_rename_daily_ventilation_review`;
RENAME TABLE `_snake_rename_daily_ventilation_review` TO `daily_ventilation_review`;
RENAME TABLE `Outcome` TO `_snake_rename_outcome`;
RENAME TABLE `_snake_rename_outcome` TO `outcome`;
RENAME TABLE `ReviewAction` TO `_snake_rename_review_action`;
RENAME TABLE `_snake_rename_review_action` TO `review_action`;
RENAME TABLE `DatasetCase` TO `_snake_rename_dataset_case`;
RENAME TABLE `_snake_rename_dataset_case` TO `dataset_case`;
RENAME TABLE `ReferenceRule` TO `_snake_rename_reference_rule`;
RENAME TABLE `_snake_rename_reference_rule` TO `reference_rule`;
RENAME TABLE `ModelVersion` TO `_snake_rename_model_version`;
RENAME TABLE `_snake_rename_model_version` TO `model_version`;
RENAME TABLE `ModelOutput` TO `_snake_rename_model_output`;
RENAME TABLE `_snake_rename_model_output` TO `model_output`;
RENAME TABLE `IdempotencyRecord` TO `_snake_rename_idempotency_record`;
RENAME TABLE `_snake_rename_idempotency_record` TO `idempotency_record`;
RENAME TABLE `SyncEvent` TO `_snake_rename_sync_event`;
RENAME TABLE `_snake_rename_sync_event` TO `sync_event`;
RENAME TABLE `AuditLog` TO `_snake_rename_audit_log`;
RENAME TABLE `_snake_rename_audit_log` TO `audit_log`;

-- Rename indexes and unique constraints to match the new physical names.
ALTER TABLE `user` DROP INDEX `User_email_key`, ADD UNIQUE INDEX `user_email_key` (`email`);
ALTER TABLE `refresh_session` DROP INDEX `RefreshSession_tokenHash_key`, ADD UNIQUE INDEX `refresh_session_token_hash_key` (`token_hash`);
ALTER TABLE `refresh_session` DROP INDEX `RefreshSession_userId_revokedAt_idx`, ADD INDEX `refresh_session_user_id_revoked_at_idx` (`user_id`, `revoked_at`);
ALTER TABLE `refresh_session` DROP INDEX `RefreshSession_expiresAt_idx`, ADD INDEX `refresh_session_expires_at_idx` (`expires_at`);
ALTER TABLE `onboarding_state` DROP INDEX `OnboardingState_userId_key`, ADD UNIQUE INDEX `onboarding_state_user_id_key` (`user_id`);
ALTER TABLE `onboarding_state` DROP INDEX `OnboardingState_selectedFacilityId_status_idx`, ADD INDEX `onboarding_state_selected_facility_id_status_idx` (`selected_facility_id`, `status`);
ALTER TABLE `onboarding_state` DROP INDEX `OnboardingState_status_currentStep_idx`, ADD INDEX `onboarding_state_status_current_step_idx` (`status`, `current_step`);
ALTER TABLE `facility` DROP INDEX `Facility_registryCode_key`, ADD UNIQUE INDEX `facility_registry_code_key` (`registry_code`);
ALTER TABLE `user_settings` DROP INDEX `UserSettings_userId_key`, ADD UNIQUE INDEX `user_settings_user_id_key` (`user_id`);
ALTER TABLE `user_settings` DROP INDEX `UserSettings_activeFacilityId_idx`, ADD INDEX `user_settings_active_facility_id_idx` (`active_facility_id`);
ALTER TABLE `facility_settings` DROP INDEX `FacilitySettings_facilityId_key`, ADD UNIQUE INDEX `facility_settings_facility_id_key` (`facility_id`);
ALTER TABLE `facility_membership` DROP INDEX `FacilityMembership_facilityId_status_idx`, ADD INDEX `facility_membership_facility_id_status_idx` (`facility_id`, `status`);
ALTER TABLE `facility_membership` DROP INDEX `FacilityMembership_userId_status_idx`, ADD INDEX `facility_membership_user_id_status_idx` (`user_id`, `status`);
ALTER TABLE `facility_membership` DROP INDEX `FacilityMembership_userId_facilityId_role_key`, ADD UNIQUE INDEX `facility_membership_user_id_facility_id_role_key` (`user_id`, `facility_id`, `role`);
ALTER TABLE `patient` DROP INDEX `Patient_facilityId_hospitalNumber_idx`, ADD INDEX `patient_facility_id_hospital_number_idx` (`facility_id`, `hospital_number`);
ALTER TABLE `patient` DROP INDEX `Patient_facilityId_patientPathway_idx`, ADD INDEX `patient_facility_id_patient_pathway_idx` (`facility_id`, `patient_pathway`);
ALTER TABLE `patient` DROP INDEX `Patient_facilityId_appPatientCode_key`, ADD UNIQUE INDEX `patient_facility_id_app_patient_code_key` (`facility_id`, `app_patient_code`);
ALTER TABLE `admission` DROP INDEX `Admission_facilityId_status_idx`, ADD INDEX `admission_facility_id_status_idx` (`facility_id`, `status`);
ALTER TABLE `admission` DROP INDEX `Admission_patientId_idx`, ADD INDEX `admission_patient_id_idx` (`patient_id`);
ALTER TABLE `admission` DROP INDEX `Admission_clientRecordId_idx`, ADD INDEX `admission_client_record_id_idx` (`client_record_id`);
ALTER TABLE `admission` DROP INDEX `Admission_facilityId_appAdmissionCode_key`, ADD UNIQUE INDEX `admission_facility_id_app_admission_code_key` (`facility_id`, `app_admission_code`);
ALTER TABLE `clinical_snapshot` DROP INDEX `ClinicalSnapshot_admissionId_measuredAt_idx`, ADD INDEX `clinical_snapshot_admission_id_measured_at_idx` (`admission_id`, `measured_at`);
ALTER TABLE `clinical_snapshot` DROP INDEX `ClinicalSnapshot_clientRecordId_idx`, ADD INDEX `clinical_snapshot_client_record_id_idx` (`client_record_id`);
ALTER TABLE `abg_test` DROP INDEX `AbgTest_admissionId_collectedAt_idx`, ADD INDEX `abg_test_admission_id_collected_at_idx` (`admission_id`, `collected_at`);
ALTER TABLE `abg_test` DROP INDEX `AbgTest_reviewStatus_idx`, ADD INDEX `abg_test_review_status_idx` (`review_status`);
ALTER TABLE `abg_test` DROP INDEX `AbgTest_clientRecordId_idx`, ADD INDEX `abg_test_client_record_id_idx` (`client_record_id`);
ALTER TABLE `abg_test` DROP INDEX `AbgTest_admissionId_version_key`, ADD UNIQUE INDEX `abg_test_admission_id_version_key` (`admission_id`, `version`);
ALTER TABLE `ventilator_setting` DROP INDEX `VentilatorSetting_admissionId_measuredAt_idx`, ADD INDEX `ventilator_setting_admission_id_measured_at_idx` (`admission_id`, `measured_at`);
ALTER TABLE `ventilator_setting` DROP INDEX `VentilatorSetting_reviewStatus_idx`, ADD INDEX `ventilator_setting_review_status_idx` (`review_status`);
ALTER TABLE `ventilator_setting` DROP INDEX `VentilatorSetting_clientRecordId_idx`, ADD INDEX `ventilator_setting_client_record_id_idx` (`client_record_id`);
ALTER TABLE `ventilator_setting` DROP INDEX `VentilatorSetting_admissionId_version_key`, ADD UNIQUE INDEX `ventilator_setting_admission_id_version_key` (`admission_id`, `version`);
ALTER TABLE `airway_device` DROP INDEX `AirwayDevice_admissionId_measuredAt_idx`, ADD INDEX `airway_device_admission_id_measured_at_idx` (`admission_id`, `measured_at`);
ALTER TABLE `airway_device` DROP INDEX `AirwayDevice_clientRecordId_idx`, ADD INDEX `airway_device_client_record_id_idx` (`client_record_id`);
ALTER TABLE `humidification_decision` DROP INDEX `HumidificationDecision_admissionId_measuredAt_idx`, ADD INDEX `humidification_decision_admission_id_measured_at_idx` (`admission_id`, `measured_at`);
ALTER TABLE `humidification_decision` DROP INDEX `HumidificationDecision_clientRecordId_idx`, ADD INDEX `humidification_decision_client_record_id_idx` (`client_record_id`);
ALTER TABLE `daily_ventilation_review` DROP INDEX `DailyVentilationReview_admissionId_reviewDate_idx`, ADD INDEX `daily_ventilation_review_admission_id_review_date_idx` (`admission_id`, `review_date`);
ALTER TABLE `daily_ventilation_review` DROP INDEX `DailyVentilationReview_clientRecordId_idx`, ADD INDEX `daily_ventilation_review_client_record_id_idx` (`client_record_id`);
ALTER TABLE `outcome` DROP INDEX `Outcome_admissionId_outcomeDate_idx`, ADD INDEX `outcome_admission_id_outcome_date_idx` (`admission_id`, `outcome_date`);
ALTER TABLE `outcome` DROP INDEX `Outcome_clientRecordId_idx`, ADD INDEX `outcome_client_record_id_idx` (`client_record_id`);
ALTER TABLE `review_action` DROP INDEX `ReviewAction_facilityId_entityType_entityId_idx`, ADD INDEX `review_action_facility_id_entity_type_entity_id_idx` (`facility_id`, `entity_type`, `entity_id`);
ALTER TABLE `review_action` DROP INDEX `ReviewAction_reviewerUserId_createdAt_idx`, ADD INDEX `review_action_reviewer_user_id_created_at_idx` (`reviewer_user_id`, `created_at`);
ALTER TABLE `dataset_case` DROP INDEX `DatasetCase_facilityId_reviewStatus_idx`, ADD INDEX `dataset_case_facility_id_review_status_idx` (`facility_id`, `review_status`);
ALTER TABLE `dataset_case` DROP INDEX `DatasetCase_approvedForTraining_datasetVersion_idx`, ADD INDEX `dataset_case_approved_for_training_dataset_version_idx` (`approved_for_training`, `dataset_version`);
ALTER TABLE `dataset_case` DROP INDEX `DatasetCase_sourceAdmissionId_idx`, ADD INDEX `dataset_case_source_admission_id_idx` (`source_admission_id`);
ALTER TABLE `reference_rule` DROP INDEX `ReferenceRule_activeFrom_activeTo_idx`, ADD INDEX `reference_rule_active_from_active_to_idx` (`active_from`, `active_to`);
ALTER TABLE `reference_rule` DROP INDEX `ReferenceRule_parameterName_patientPathway_population_idx`, ADD INDEX `reference_rule_parameter_name_patient_pathway_population_idx` (`parameter_name`, `patient_pathway`, `population`);
ALTER TABLE `reference_rule` DROP INDEX `ReferenceRule_facilityId_verificationStatus_idx`, ADD INDEX `reference_rule_facility_id_verification_status_idx` (`facility_id`, `verification_status`);
ALTER TABLE `reference_rule` DROP INDEX `ReferenceRule_verificationStatus_activeFrom_activeTo_idx`, ADD INDEX `reference_rule_verification_status_active_from_active_to_idx` (`verification_status`, `active_from`, `active_to`);
ALTER TABLE `reference_rule` DROP INDEX `ReferenceRule_name_version_key`, ADD UNIQUE INDEX `reference_rule_name_version_key` (`name`, `version`);
ALTER TABLE `model_version` DROP INDEX `ModelVersion_approvalStatus_idx`, ADD INDEX `model_version_approval_status_idx` (`approval_status`);
ALTER TABLE `model_version` DROP INDEX `ModelVersion_modelName_version_key`, ADD UNIQUE INDEX `model_version_model_name_version_key` (`model_name`, `version`);
ALTER TABLE `model_output` DROP INDEX `ModelOutput_modelVersionId_createdAt_idx`, ADD INDEX `model_output_model_version_id_created_at_idx` (`model_version_id`, `created_at`);
ALTER TABLE `model_output` DROP INDEX `ModelOutput_facilityId_createdAt_idx`, ADD INDEX `model_output_facility_id_created_at_idx` (`facility_id`, `created_at`);
ALTER TABLE `model_output` DROP INDEX `ModelOutput_sourceAdmissionId_idx`, ADD INDEX `model_output_source_admission_id_idx` (`source_admission_id`);
ALTER TABLE `idempotency_record` DROP INDEX `IdempotencyRecord_facilityId_operation_idx`, ADD INDEX `idempotency_record_facility_id_operation_idx` (`facility_id`, `operation`);
ALTER TABLE `idempotency_record` DROP INDEX `IdempotencyRecord_clientRecordId_idx`, ADD INDEX `idempotency_record_client_record_id_idx` (`client_record_id`);
ALTER TABLE `idempotency_record` DROP INDEX `IdempotencyRecord_userId_key_key`, ADD UNIQUE INDEX `idempotency_record_user_id_key_key` (`user_id`, `key`);
ALTER TABLE `sync_event` DROP INDEX `SyncEvent_facilityId_status_idx`, ADD INDEX `sync_event_facility_id_status_idx` (`facility_id`, `status`);
ALTER TABLE `sync_event` DROP INDEX `SyncEvent_clientRecordId_idx`, ADD INDEX `sync_event_client_record_id_idx` (`client_record_id`);
ALTER TABLE `sync_event` DROP INDEX `SyncEvent_idempotencyKey_idx`, ADD INDEX `sync_event_idempotency_key_idx` (`idempotency_key`);
ALTER TABLE `audit_log` DROP INDEX `AuditLog_facilityId_entityType_entityId_idx`, ADD INDEX `audit_log_facility_id_entity_type_entity_id_idx` (`facility_id`, `entity_type`, `entity_id`);
ALTER TABLE `audit_log` DROP INDEX `AuditLog_userId_createdAt_idx`, ADD INDEX `audit_log_user_id_created_at_idx` (`user_id`, `created_at`);
ALTER TABLE `audit_log` DROP INDEX `AuditLog_action_createdAt_idx`, ADD INDEX `audit_log_action_created_at_idx` (`action`, `created_at`);

-- Recreate foreign keys with lowercase_snake constraint, table, and column names.
ALTER TABLE `refresh_session` ADD CONSTRAINT `refresh_session_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `onboarding_state` ADD CONSTRAINT `onboarding_state_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `onboarding_state` ADD CONSTRAINT `onboarding_state_selected_facility_id_fkey` FOREIGN KEY (`selected_facility_id`) REFERENCES `facility`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `user_settings` ADD CONSTRAINT `user_settings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `user_settings` ADD CONSTRAINT `user_settings_active_facility_id_fkey` FOREIGN KEY (`active_facility_id`) REFERENCES `facility`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `facility_settings` ADD CONSTRAINT `facility_settings_facility_id_fkey` FOREIGN KEY (`facility_id`) REFERENCES `facility`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `facility_membership` ADD CONSTRAINT `facility_membership_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `facility_membership` ADD CONSTRAINT `facility_membership_facility_id_fkey` FOREIGN KEY (`facility_id`) REFERENCES `facility`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `facility_membership` ADD CONSTRAINT `facility_membership_approved_by_user_id_fkey` FOREIGN KEY (`approved_by_user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `patient` ADD CONSTRAINT `patient_facility_id_fkey` FOREIGN KEY (`facility_id`) REFERENCES `facility`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `admission` ADD CONSTRAINT `admission_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `admission` ADD CONSTRAINT `admission_facility_id_fkey` FOREIGN KEY (`facility_id`) REFERENCES `facility`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `admission` ADD CONSTRAINT `admission_created_by_user_id_fkey` FOREIGN KEY (`created_by_user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `clinical_snapshot` ADD CONSTRAINT `clinical_snapshot_admission_id_fkey` FOREIGN KEY (`admission_id`) REFERENCES `admission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `clinical_snapshot` ADD CONSTRAINT `clinical_snapshot_entered_by_user_id_fkey` FOREIGN KEY (`entered_by_user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `abg_test` ADD CONSTRAINT `abg_test_admission_id_fkey` FOREIGN KEY (`admission_id`) REFERENCES `admission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `abg_test` ADD CONSTRAINT `abg_test_entered_by_user_id_fkey` FOREIGN KEY (`entered_by_user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `abg_test` ADD CONSTRAINT `abg_test_reviewed_by_user_id_fkey` FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `ventilator_setting` ADD CONSTRAINT `ventilator_setting_admission_id_fkey` FOREIGN KEY (`admission_id`) REFERENCES `admission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `ventilator_setting` ADD CONSTRAINT `ventilator_setting_entered_by_user_id_fkey` FOREIGN KEY (`entered_by_user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `airway_device` ADD CONSTRAINT `airway_device_admission_id_fkey` FOREIGN KEY (`admission_id`) REFERENCES `admission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `airway_device` ADD CONSTRAINT `airway_device_entered_by_user_id_fkey` FOREIGN KEY (`entered_by_user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `humidification_decision` ADD CONSTRAINT `humidification_decision_admission_id_fkey` FOREIGN KEY (`admission_id`) REFERENCES `admission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `humidification_decision` ADD CONSTRAINT `humidification_decision_confirmed_by_user_id_fkey` FOREIGN KEY (`confirmed_by_user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `daily_ventilation_review` ADD CONSTRAINT `daily_ventilation_review_admission_id_fkey` FOREIGN KEY (`admission_id`) REFERENCES `admission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `daily_ventilation_review` ADD CONSTRAINT `daily_ventilation_review_reviewed_by_user_id_fkey` FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `outcome` ADD CONSTRAINT `outcome_admission_id_fkey` FOREIGN KEY (`admission_id`) REFERENCES `admission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `outcome` ADD CONSTRAINT `outcome_entered_by_user_id_fkey` FOREIGN KEY (`entered_by_user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `review_action` ADD CONSTRAINT `review_action_facility_id_fkey` FOREIGN KEY (`facility_id`) REFERENCES `facility`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `review_action` ADD CONSTRAINT `review_action_reviewer_user_id_fkey` FOREIGN KEY (`reviewer_user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `dataset_case` ADD CONSTRAINT `dataset_case_facility_id_fkey` FOREIGN KEY (`facility_id`) REFERENCES `facility`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `dataset_case` ADD CONSTRAINT `dataset_case_source_admission_id_fkey` FOREIGN KEY (`source_admission_id`) REFERENCES `admission`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `dataset_case` ADD CONSTRAINT `dataset_case_approved_by_user_id_fkey` FOREIGN KEY (`approved_by_user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `dataset_case` ADD CONSTRAINT `dataset_case_reviewed_by_user_id_fkey` FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `reference_rule` ADD CONSTRAINT `reference_rule_facility_id_fkey` FOREIGN KEY (`facility_id`) REFERENCES `facility`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `reference_rule` ADD CONSTRAINT `reference_rule_approved_by_user_id_fkey` FOREIGN KEY (`approved_by_user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `reference_rule` ADD CONSTRAINT `reference_rule_verified_by_user_id_fkey` FOREIGN KEY (`verified_by_user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `model_output` ADD CONSTRAINT `model_output_model_version_id_fkey` FOREIGN KEY (`model_version_id`) REFERENCES `model_version`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `model_output` ADD CONSTRAINT `model_output_source_admission_id_fkey` FOREIGN KEY (`source_admission_id`) REFERENCES `admission`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `idempotency_record` ADD CONSTRAINT `idempotency_record_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `idempotency_record` ADD CONSTRAINT `idempotency_record_facility_id_fkey` FOREIGN KEY (`facility_id`) REFERENCES `facility`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `sync_event` ADD CONSTRAINT `sync_event_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `sync_event` ADD CONSTRAINT `sync_event_facility_id_fkey` FOREIGN KEY (`facility_id`) REFERENCES `facility`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `audit_log` ADD CONSTRAINT `audit_log_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `audit_log` ADD CONSTRAINT `audit_log_facility_id_fkey` FOREIGN KEY (`facility_id`) REFERENCES `facility`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO `_prisma_migrations`
  (`id`, `checksum`, `migration_name`, `started_at`, `finished_at`, `applied_steps_count`)
SELECT '0e950173-7c73-3bba-649c-14fac5a73d7d', '8a771687af8fb8d72aa08c29d784604b640bbe2f02a873533a0d1e5f213d7fcd', '20260507090000_lowercase_snake_database_names', NOW(3), NOW(3), 1
WHERE NOT EXISTS (SELECT 1 FROM `_prisma_migrations` WHERE `migration_name` = '20260507090000_lowercase_snake_database_names');

-- Migration: 20260507194500_user_display_preferences
ALTER TABLE `user_settings`
  ADD COLUMN `display_preferences_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`display_preferences_json`));

INSERT INTO `_prisma_migrations`
  (`id`, `checksum`, `migration_name`, `started_at`, `finished_at`, `applied_steps_count`)
SELECT '440991c0-6fa3-57aa-7f99-89ef387c2350', 'e447b2adf37c9983d6aaffbbc7c51d3ea13c05a04ebf3b742468860ab27f22fa', '20260507194500_user_display_preferences', NOW(3), NOW(3), 1
WHERE NOT EXISTS (SELECT 1 FROM `_prisma_migrations` WHERE `migration_name` = '20260507194500_user_display_preferences');

-- Migration: 20260511110000_patient_age_days
ALTER TABLE `patient` ADD COLUMN `age_days` INTEGER NULL;

INSERT INTO `_prisma_migrations`
  (`id`, `checksum`, `migration_name`, `started_at`, `finished_at`, `applied_steps_count`)
SELECT 'ce1332eb-ab91-9e86-4ec4-7978c564322d', '08a232fef3e4c2031a12139069f7c88ad76d38d87dfa7c77239a23166d906e9e', '20260511110000_patient_age_days', NOW(3), NOW(3), 1
WHERE NOT EXISTS (SELECT 1 FROM `_prisma_migrations` WHERE `migration_name` = '20260511110000_patient_age_days');

-- Migration: 20260511163000_patient_split_names
ALTER TABLE `patient`
  ADD COLUMN `first_name` VARCHAR(80) NULL,
  ADD COLUMN `last_name` VARCHAR(80) NULL;

UPDATE `patient`
SET
  `first_name` = NULLIF(TRIM(SUBSTRING_INDEX(`optional_name`, ' ', 1)), ''),
  `last_name` = NULLIF(TRIM(SUBSTRING(`optional_name`, LENGTH(SUBSTRING_INDEX(`optional_name`, ' ', 1)) + 2)), '')
WHERE `optional_name` IS NOT NULL
  AND `first_name` IS NULL;

INSERT INTO `_prisma_migrations`
  (`id`, `checksum`, `migration_name`, `started_at`, `finished_at`, `applied_steps_count`)
SELECT 'cb56a67e-e374-b7c5-f909-5a8f21a9f533', '321e374cb6979f7bd0e034bca84d9891794b95a37d1afaf2b38560f993730e2d', '20260511163000_patient_split_names', NOW(3), NOW(3), 1
WHERE NOT EXISTS (SELECT 1 FROM `_prisma_migrations` WHERE `migration_name` = '20260511163000_patient_split_names');

-- Migration: 20260511221000_six_character_app_codes
UPDATE `patient`
SET `app_patient_code` = CASE
  WHEN CHAR_LENGTH(`app_patient_code`) = 6
   AND `app_patient_code` REGEXP '^[[:alnum:]]{6}$'
  THEN UPPER(`app_patient_code`)
  ELSE UPPER(SUBSTRING(SHA2(CONCAT(`facility_id`, ':', `id`), 256), 1, 6))
END
WHERE CHAR_LENGTH(`app_patient_code`) <> 6
   OR `app_patient_code` REGEXP '[^[:alnum:]]'
   OR BINARY `app_patient_code` <> UPPER(`app_patient_code`);

UPDATE `admission`
SET `app_admission_code` = CASE
  WHEN CHAR_LENGTH(`app_admission_code`) = 6
   AND `app_admission_code` REGEXP '^[[:alnum:]]{6}$'
  THEN UPPER(`app_admission_code`)
  ELSE UPPER(SUBSTRING(SHA2(CONCAT(`facility_id`, ':', `id`), 256), 1, 6))
END
WHERE CHAR_LENGTH(`app_admission_code`) <> 6
   OR `app_admission_code` REGEXP '[^[:alnum:]]'
   OR BINARY `app_admission_code` <> UPPER(`app_admission_code`);

ALTER TABLE `patient` MODIFY COLUMN `app_patient_code` VARCHAR(6) NOT NULL;
ALTER TABLE `admission` MODIFY COLUMN `app_admission_code` VARCHAR(6) NOT NULL;

INSERT INTO `_prisma_migrations`
  (`id`, `checksum`, `migration_name`, `started_at`, `finished_at`, `applied_steps_count`)
SELECT '91aa4b54-a197-3b9b-9aee-bb11f9c6bc3d', '384049309c9b12ed3a3310c3bed7d84e29ec28f6f9725798a2b0575aaf789946', '20260511221000_six_character_app_codes', NOW(3), NOW(3), 1
WHERE NOT EXISTS (SELECT 1 FROM `_prisma_migrations` WHERE `migration_name` = '20260511221000_six_character_app_codes');

SET FOREIGN_KEY_CHECKS=1;
