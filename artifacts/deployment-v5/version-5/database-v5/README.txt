Collins Version 5 database files

Files:
- collins-database-v5-full.sql: phpMyAdmin import for a fresh/empty MySQL or MariaDB database.
- collins-database-v4-to-v5.sql: phpMyAdmin import for an existing Version 4 database that has already applied migrations through 20260511110000_patient_age_days.

Production cPanel deployment can alternatively run `npm run db:migrate:deploy` from backend-v5 after configuring .env.production.
Always back up an existing database before importing SQL through phpMyAdmin.

Included migrations: 20260505133000_init, 20260505140600_patient_pathway_details, 20260507090000_lowercase_snake_database_names, 20260507194500_user_display_preferences, 20260511110000_patient_age_days, 20260511163000_patient_split_names, 20260511221000_six_character_app_codes
