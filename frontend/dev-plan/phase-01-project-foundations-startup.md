# Phase 01 - Project Foundations And Startup Checks

## Goal

Keep Expo web, Android, and iOS startup stable before feature work continues.

## Inspect And Reuse First

- Inspect Expo config, Metro config, Babel aliases, package files, lockfiles, logging/debug imports, router layout, error boundaries, platform components, and startup tests.
- Reuse existing Expo Router, API client, Redux store, persistence, theme, i18n, accessibility, logging, and error-boundary foundations when compliant.

## Implementation Scope

- Keep Expo SDK 54 compatibility and use Expo-compatible dependency management for future package changes.
- Confirm route aliases, debug/logging modules, and platform files resolve on web, Android, and iOS.
- Keep startup UI minimal and avoid landing-page or marketing screens.
- Preserve mobile web layout parity with Android and iOS.

## Cleanup During Future Work

- Remove obsolete aliases, unused debug shims, and dead startup files only after cache-cleared web and mobile startup are verified.
- Do not remove logging blindly; replace it with the project logging convention.

## Future Tests

- Startup/config tests for Expo, Metro, Babel aliases, and logging/debug initialization.
- Smoke tests for router layout and error boundary rendering.
- Accessibility checks for the first screen shown after startup.
