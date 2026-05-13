VERSION: 1.0.0

Create the deployment package for the release version declared above.

Use the declared `VERSION` value to generate all versioned folder and file names.

The output should be created inside the existing `artifacts` folder located at the root of the project repository.

Create the following folder:

```txt
artifacts/version-{VERSION}
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

Create another ZIP folder containing the frontend web build that will be uploaded to **cPanel** and deployed to the domain.

This should include the correct frontend web deployment files required for hosting.

## Android APK

Create an installable Android APK for the declared release version.

## Final Output

The final `artifacts/version-{VERSION}` folder should contain the following generated files:

```txt
backend-v{VERSION}.zip
frontend-web-v{VERSION}.zip
android-v{VERSION}.apk
```

Make sure everything is functional, synchronized, and ready for deployment before creating the final files.
