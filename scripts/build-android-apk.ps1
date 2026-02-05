# Local Android APK build script
# Requires: Java 17, Android SDK, ANDROID_HOME
# Install Java 17: https://adoptium.net/

$ErrorActionPreference = "Stop"
# Use JAVA_HOME if set (e.g. JDK 17) so gradle and java use it
if ($env:JAVA_HOME) {
  $env:Path = "$env:JAVA_HOME\bin;$env:Path"
}
$prevErr = $ErrorActionPreference
$ErrorActionPreference = "SilentlyContinue"
$javaVersion = (& java -version 2>&1) -join "`n"
$ErrorActionPreference = $prevErr
if ($javaVersion -match '"2[4-9]' -or $javaVersion -match '"25') {
  Write-Host "ERROR: Java 24+ detected. React Native requires Java 17 or 21." -ForegroundColor Red
  Write-Host "  Install from https://adoptium.net/ and set JAVA_HOME, e.g.:" -ForegroundColor Yellow
  Write-Host '  $env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17"' -ForegroundColor Cyan
  exit 1
}

Set-Location $PSScriptRoot\..
Write-Host "Building release APK..." -ForegroundColor Green
Push-Location android
& .\gradlew.bat assembleRelease
$exitCode = $LASTEXITCODE
Pop-Location
if ($exitCode -ne 0) { exit $exitCode }
if ($exitCode -eq 0) {
  $apk = "android\app\build\outputs\apk\release\app-release.apk"
  if (Test-Path $apk) {
    Write-Host "`nAPK built: $apk" -ForegroundColor Green
  }
}
