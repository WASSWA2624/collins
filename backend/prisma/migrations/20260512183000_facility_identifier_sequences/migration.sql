ALTER TABLE `patient` MODIFY COLUMN `app_patient_code` VARCHAR(32) NOT NULL;
ALTER TABLE `admission` MODIFY COLUMN `app_admission_code` VARCHAR(32) NOT NULL;

CREATE TABLE `facility_identifier_sequence` (
  `id` VARCHAR(191) NOT NULL,
  `facility_id` VARCHAR(191) NOT NULL,
  `patient_sequence` INTEGER NOT NULL DEFAULT 0,
  `admission_sequence` INTEGER NOT NULL DEFAULT 0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,

  UNIQUE INDEX `facility_identifier_sequence_facility_id_key`(`facility_id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

UPDATE `patient`
SET `app_patient_code` = CONCAT('TMPP', SUBSTRING(SHA2(`id`, 256), 1, 28));

UPDATE `admission`
SET `app_admission_code` = CONCAT('TMPA', SUBSTRING(SHA2(`id`, 256), 1, 28));

DROP TEMPORARY TABLE IF EXISTS `_identifier_facility_parts`;
CREATE TEMPORARY TABLE `_identifier_facility_parts` AS
SELECT
  `id` AS `facility_id`,
  UPPER(COALESCE(NULLIF(REGEXP_REPLACE(`name`, '[^[:alpha:]]+', ''), ''), 'FAC')) AS `compact_letters`,
  UPPER(COALESCE(NULLIF(TRIM(REGEXP_REPLACE(`name`, '[^[:alpha:]]+', ' ')), ''), 'FACILITY')) AS `word_letters`
FROM `facility`;

DROP TEMPORARY TABLE IF EXISTS `_patient_identifier_codes`;
CREATE TEMPORARY TABLE `_patient_identifier_codes` AS
SELECT
  `patient_rank`.`id` AS `patient_id`,
  CONCAT(
    RPAD(SUBSTRING(`facility_parts`.`compact_letters`, 1, 3), 3, 'X'),
    LPAD(`patient_rank`.`sequence_number`, 4, '0')
  ) AS `app_patient_code`
FROM (
  SELECT
    `id`,
    `facility_id`,
    ROW_NUMBER() OVER (PARTITION BY `facility_id` ORDER BY `created_at`, `id`) AS `sequence_number`
  FROM `patient`
) AS `patient_rank`
JOIN `_identifier_facility_parts` AS `facility_parts`
  ON `facility_parts`.`facility_id` = `patient_rank`.`facility_id`;

UPDATE `patient` AS `patient`
JOIN `_patient_identifier_codes` AS `codes`
  ON `codes`.`patient_id` = `patient`.`id`
SET `patient`.`app_patient_code` = `codes`.`app_patient_code`;

DROP TEMPORARY TABLE IF EXISTS `_identifier_patient_parts`;
CREATE TEMPORARY TABLE `_identifier_patient_parts` AS
SELECT
  `id` AS `patient_id`,
  UPPER(REGEXP_REPLACE(COALESCE(`first_name`, ''), '[^[:alpha:]]+', '')) AS `first_letters`,
  UPPER(REGEXP_REPLACE(COALESCE(`last_name`, ''), '[^[:alpha:]]+', '')) AS `last_letters`,
  UPPER(REGEXP_REPLACE(COALESCE(`optional_name`, ''), '[^[:alpha:]]+', '')) AS `optional_letters`
FROM `patient`;

DROP TEMPORARY TABLE IF EXISTS `_admission_identifier_codes`;
CREATE TEMPORARY TABLE `_admission_identifier_codes` AS
SELECT
  `admission_rank`.`id` AS `admission_id`,
  CONCAT(
    RPAD(
      CASE
        WHEN `patient_parts`.`first_letters` <> '' AND `patient_parts`.`last_letters` <> ''
          THEN CONCAT(SUBSTRING(`patient_parts`.`first_letters`, 1, 2), SUBSTRING(`patient_parts`.`last_letters`, 1, 2))
        ELSE SUBSTRING(COALESCE(NULLIF(`patient_parts`.`first_letters`, ''), NULLIF(`patient_parts`.`optional_letters`, ''), 'PATI'), 1, 4)
      END,
      4,
      'X'
    ),
    RPAD(
      CASE
        WHEN LOCATE(' ', `facility_parts`.`word_letters`) > 0
          THEN CONCAT(
            SUBSTRING(SUBSTRING_INDEX(`facility_parts`.`word_letters`, ' ', 1), 1, 1),
            SUBSTRING(SUBSTRING_INDEX(TRIM(SUBSTRING(`facility_parts`.`word_letters`, LOCATE(' ', `facility_parts`.`word_letters`) + 1)), ' ', 1), 1, 1)
          )
        ELSE SUBSTRING(`facility_parts`.`word_letters`, 1, 2)
      END,
      2,
      'X'
    ),
    LPAD(`admission_rank`.`sequence_number`, 4, '0')
  ) AS `app_admission_code`
FROM (
  SELECT
    `id`,
    `patient_id`,
    `facility_id`,
    ROW_NUMBER() OVER (PARTITION BY `facility_id` ORDER BY `admitted_at`, `created_at`, `id`) AS `sequence_number`
  FROM `admission`
) AS `admission_rank`
JOIN `_identifier_patient_parts` AS `patient_parts`
  ON `patient_parts`.`patient_id` = `admission_rank`.`patient_id`
JOIN `_identifier_facility_parts` AS `facility_parts`
  ON `facility_parts`.`facility_id` = `admission_rank`.`facility_id`;

UPDATE `admission` AS `admission`
JOIN `_admission_identifier_codes` AS `codes`
  ON `codes`.`admission_id` = `admission`.`id`
SET `admission`.`app_admission_code` = `codes`.`app_admission_code`;

INSERT INTO `facility_identifier_sequence`
  (`id`, `facility_id`, `patient_sequence`, `admission_sequence`, `created_at`, `updated_at`)
SELECT
  CONCAT('fis_', SUBSTRING(SHA2(`facility`.`id`, 256), 1, 24)) AS `id`,
  `facility`.`id` AS `facility_id`,
  COALESCE(`patient_counts`.`record_count`, 0) AS `patient_sequence`,
  COALESCE(`admission_counts`.`record_count`, 0) AS `admission_sequence`,
  NOW(3) AS `created_at`,
  NOW(3) AS `updated_at`
FROM `facility` AS `facility`
LEFT JOIN (
  SELECT `facility_id`, COUNT(*) AS `record_count`
  FROM `patient`
  GROUP BY `facility_id`
) AS `patient_counts`
  ON `patient_counts`.`facility_id` = `facility`.`id`
LEFT JOIN (
  SELECT `facility_id`, COUNT(*) AS `record_count`
  FROM `admission`
  GROUP BY `facility_id`
) AS `admission_counts`
  ON `admission_counts`.`facility_id` = `facility`.`id`;

ALTER TABLE `facility_identifier_sequence`
  ADD CONSTRAINT `facility_identifier_sequence_facility_id_fkey`
  FOREIGN KEY (`facility_id`) REFERENCES `facility`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

DROP TEMPORARY TABLE IF EXISTS `_admission_identifier_codes`;
DROP TEMPORARY TABLE IF EXISTS `_identifier_patient_parts`;
DROP TEMPORARY TABLE IF EXISTS `_patient_identifier_codes`;
DROP TEMPORARY TABLE IF EXISTS `_identifier_facility_parts`;
