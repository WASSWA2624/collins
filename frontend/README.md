# Collins Frontend

Expo Router React Native frontend for the Collins ICU ventilation admission, tracking, and decision-support app.

## Purpose

This app is a clinical decision-support and data-capture frontend for ICU ventilation workflows. It supports clinician judgement; it must not diagnose, prescribe, intubate, extubate, or set ventilator settings autonomously.

The product vision and clinical requirements are documented at:

```txt
../app-write-up.md
```

## Platform support

- Android
- iOS
- Web

## Requirements

- Node.js >= 20
- npm
- Expo CLI through `npx expo` or a global Expo/EAS install

## Setup

```bash
npm install
cp .env.example .env
npm run start
```

## Common scripts

```bash
npm run start         # Start Expo dev server
npm run android       # Run Android app
npm run ios           # Run iOS app
npm run web           # Run web app
npm run test          # Run tests
npm run test:coverage # Run tests with coverage
```

## Project structure

```txt
frontend/
  app-rules/       # Frontend architecture and coding rules
  dev-plan.md      # Current state and next implementation steps
  assets/          # Static assets used by Expo
  public/          # Web/public assets and manifest
  src/             # App source code
  android/         # Android native project files
```

## Safety position

- Rule-based and calculator-based MVP first.
- Predictive models must stay in silent/shadow mode until clinically validated and governed.
- Unreviewed patient data must never influence live guidance.
- Clinical prompts must show missing data, uncertainty, and clinician-confirmation language.
