Create the **Version 1.0.0 deployment package**.

The output should be created inside the existing **artifacts** folder located at the root of the project repository.

Create the following folder:

```txt
artifacts/version-1.0.0
```

## Pre-Deployment Cleanup

Before creating the deployment files:

* Clean up all users except:

  * Clinician account
  * Admin account

* Clean up all patients so that the database starts clean.

* Run all necessary database migrations.

* Make sure the backend, frontend, and database are fully synchronized.

## Backend Deployment Package

Create a ZIP folder containing all backend code required for deployment on **cPanel**.

The backend package should be compatible with **Linux/Unix cPanel hosting**.

Use POSIX-compatible conventions for files, paths, scripts, and line endings.

## Frontend Web Deployment Package

Create another ZIP folder containing the frontend web version that will be uploaded to **cPanel** and deployed to the domain.

This should include the correct frontend web deployment files required for hosting.

## Android APK

Create an installable **Android APK** for **Version 1.0.0**.

## Final Output

The final `artifacts/version-1.0.0` folder should contain:

```txt
backend-v1.0.0.zip
frontend-web-v1.0.0.zip
android-v1.0.0.apk
```

Make sure everything is functional, synchronized, and ready for deployment before creating the final files.