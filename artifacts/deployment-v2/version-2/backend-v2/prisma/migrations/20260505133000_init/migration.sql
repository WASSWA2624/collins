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
