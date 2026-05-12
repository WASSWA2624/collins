-- Collins database upgrade from Version 4 to Version 5
-- Target: MySQL/MariaDB via phpMyAdmin or mysql CLI.
-- Generated: 2026-05-12T09:38:46.470Z
-- Import into a database that is already migrated through 20260511110000_patient_age_days.
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
