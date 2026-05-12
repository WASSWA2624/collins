ALTER TABLE `patient`
  ADD COLUMN `first_name` VARCHAR(80) NULL,
  ADD COLUMN `last_name` VARCHAR(80) NULL;

UPDATE `patient`
SET
  `first_name` = NULLIF(TRIM(SUBSTRING_INDEX(`optional_name`, ' ', 1)), ''),
  `last_name` = NULLIF(TRIM(SUBSTRING(`optional_name`, LENGTH(SUBSTRING_INDEX(`optional_name`, ' ', 1)) + 2)), '')
WHERE `optional_name` IS NOT NULL
  AND `first_name` IS NULL;
