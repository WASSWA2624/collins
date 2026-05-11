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
