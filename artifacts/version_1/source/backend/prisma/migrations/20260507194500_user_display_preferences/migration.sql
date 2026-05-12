ALTER TABLE `user_settings`
  ADD COLUMN `display_preferences_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`display_preferences_json`));
