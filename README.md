# Mapilio Mobile

A street-level imagery capture app for iOS and Android, built with Expo (bare workflow) and React Native. Contribute to the world's open map by capturing geotagged 360° and standard photos while you walk, cycle, or drive.

[![CI](https://github.com/mapilio/mobile-apps/actions/workflows/ci.yml/badge.svg)](https://github.com/mapilio/mobile-apps/actions/workflows/ci.yml)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2057-000020?logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.86.2-61dafb?logo=react)](https://reactnative.dev)
[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey)](https://reactnative.dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![OpenStreetMap](https://img.shields.io/badge/community-OpenStreetMap-7EBC6F?logo=openstreetmap&logoColor=white)](https://www.openstreetmap.org)

---

## Features

- **Camera capture** — GPS-tagged photos with automatic interval shooting
- **Sequence management** — Organize, review, and upload photo sequences
- **Interactive map** — Browse captured imagery on a MapLibre-powered map
- **Social layer** — Profiles, leaderboards, awards, and a marketplace
- **Upload pipeline** — Background upload with progress tracking and retry
- **Offline-first** — Local SQLite database; syncs when connectivity is restored
- **Localization** — 31 languages supported via i18next
- **Multi-auth** — Email, Google, Apple, Facebook, and OpenStreetMap OAuth

---

## Scope

Mapilio is a **street-level imagery capture and contribution app** for OpenStreetMap mappers and the open mapping community. Its mission is to make it easy to capture geotagged imagery on foot, by bicycle, or in a vehicle, and contribute it to the open mapping ecosystem.

**In scope**

- Capturing geotagged photos at configurable intervals during a journey
- Reviewing, managing, and uploading captured sequences to the Mapilio platform
- Browsing contributed imagery on a MapLibre-powered map
- Integration with the Mapilio API for storage, processing, and publication

**Out of scope**

- General-purpose photography or video recording
- Real-time navigation, turn-by-turn directions, or offline map downloads
- Social networking beyond contributor profiles and the community leaderboard
- Server-side image processing — that is handled by the Mapilio backend

If you have an idea that falls outside this scope, please open a [Discussion](../../discussions) rather than an Issue. Feature requests are evaluated against the capture-and-contribute mission; the project aims to do a few things well rather than many things broadly.

See the [public roadmap](ROADMAP.md) for release gates, near-term priorities, and longer-term direction. GitHub issues, milestones, and discussions remain the source of truth; the roadmap includes no dates or promises.

---

## Tech Stack

| Layer         | Library                                  |
| ------------- | ---------------------------------------- |
| Framework     | Expo SDK 57 (Bare Workflow)              |
| Runtime       | React Native 0.86.2                      |
| UI library    | React 19.2.3                             |
| Navigation    | React Navigation v7                      |
| State         | Redux 5 + Redux-Persist                  |
| Maps          | MapLibre React Native                    |
| Database      | expo-sqlite                              |
| File system   | expo-file-system (adapter: `util/fs.js`) |
| Camera        | expo-camera                              |
| Location      | expo-location                            |
| Notifications | OneSignal + expo-sensors                 |
| Monitoring    | Sentry                                   |
| Testing       | Jest 29 + jest-expo                      |

---

## Prerequisites

| Tool           | Version                 |
| -------------- | ----------------------- |
| Node.js        | >=22.13 <25             |
| npm            | 10+                     |
| Expo CLI       | `npm i -g expo-cli`     |
| Xcode          | 15+ (iOS only)          |
| Android Studio | Giraffe+ (Android only) |
| CocoaPods      | 1.14+ (iOS only)        |

> **macOS + nvm users:** After switching Node versions run `ln -s $(which node) /usr/local/bin/node` so Xcode build scripts can find Node.

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/mapilio/mobile-apps.git
cd mobile-apps
nvm use
npm ci
```

### 2. Environment variables

```bash
cp .env.example .env.development
```

Open `.env.development` and fill in your credentials (see [Environment Variables](#environment-variables) below).

### 3. iOS (macOS only)

```bash
npx expo run:ios
```

### 4. Android

```bash
npx expo run:android
```

### Update native dependencies

```bash
# Install an Expo-compatible package version
npx expo install <package>

# Refresh iOS pods after native dependency changes
npx pod-install
```

The committed Android and iOS projects contain reviewed Mapilio integrations.
Do not run `expo prebuild --clean`. When a config plugin must update native
files, use a dedicated branch, run prebuild without `--clean`, and review every
generated native diff before opening the pull request.

### Production Android builds

Production builds use release credentials managed outside this repository. The
`production` EAS profile explicitly uses Expo's remote credential store:

```bash
eas build --platform android --profile production
```

The tracked `android/app/debug.keystore` is only for local debug builds. A local
Gradle release build is intentionally not configured to use that key; provide a
secure external signing configuration when building outside EAS.

---

## Environment Variables

Copy `.env.example` to `.env.development` (local dev) or `.env.production` (release builds) and provide only non-sensitive public runtime values. Expo embeds every `EXPO_PUBLIC_*` value in the app bundle, so never put a confidential credential in one of these variables.

| Variable                               | Description                                |
| -------------------------------------- | ------------------------------------------ |
| `EXPO_PUBLIC_SERVICE_URL`              | Mapilio REST API base URL                  |
| `EXPO_PUBLIC_ROAD_TILE_URL`            | Self-hosted road vector-tile URL template  |
| `EXPO_PUBLIC_ROAD_TILE_ID`             | Road source-layer ID                       |
| `EXPO_PUBLIC_POINT_TILE_URL`           | Self-hosted point vector-tile URL template |
| `EXPO_PUBLIC_POINT_TILE_ID`            | Point source-layer ID                      |
| `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`     | Google Sign-In iOS client ID               |
| `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` | Google Sign-In Android client ID           |
| `EXPO_PUBLIC_SENTRY_DSN`               | Sentry DSN for error reporting             |
| `EXPO_PUBLIC_ONESIGNAL_APP_ID`         | OneSignal app ID for push notifications    |

See `.env.example` for the full list. Existing deployments can continue using the
legacy `EXPO_PUBLIC_MAPBOX_ROAD_*` and `EXPO_PUBLIC_MAPBOX_POINT_*` names during
migration; new installations should use the neutral tile variables above.

Social sign-in exchanges provider tokens through the backend-first
`/api/v1/mobile/auth/social-token` endpoint. The mobile bundle contains only
provider client identifiers and platform-SDK values intended for public native
clients. Provider tokens and backend tokens are sent in request bodies; backend
OAuth client secrets must never be configured in the mobile environment.

---

## Running Tests

```bash
# Interactive watch mode
npm test

# CI (single run, no watch)
npm run test:ci

# With coverage report
npm run test:ci -- --coverage
```

The test suite covers reducers, helper functions, configuration, and the file-system adapter (more than 250 tests).

---

## Project Structure

```
mobile-apps/
├── App.js                  # Root component (providers, global toast shim)
├── index.js                # Expo entry point
├── db.js                   # SQLite initialization
├── util/
│   └── fs.js               # File-system adapter (expo-file-system wrapper)
├── store/
│   ├── store.js
│   ├── actionsName.ts
│   ├── actions/
│   └── reducers/           # cameraReducer, generalReducer, loginReducer, …
├── screens/                # Full-screen views (AppCamera, AppMap, Login, …)
├── components/             # Reusable UI components
├── highordercomponents/    # Higher-order components (MapView, …)
├── navigator/              # React Navigation stacks & tabs
├── helper/                 # Pure utility functions (calculator, upload, …)
├── hooks/                  # Custom React hooks
├── styles/                 # Global style constants
├── translations/           # i18n JSON files (31 locales)
├── types/                  # TypeScript type definitions
├── __tests__/              # Jest test suites
├── android/                # Android native project
└── ios/                    # iOS native project
```

---

## Contributing

We welcome bug reports, feature requests, and pull requests. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting.

---

## License

Licensed under the [Apache License, Version 2.0](LICENSE).
Bundled third-party materials are documented in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Copyright 2024–2026 Mapilio
