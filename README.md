# Mapilio Mobile

A street-level imagery capture app for iOS and Android, built with Expo (bare workflow) and React Native. Contribute to the world's open map by capturing geotagged 360° and standard photos while you walk, cycle, or drive.

[![CI](https://github.com/mapilio/mobile-apps/actions/workflows/ci.yml/badge.svg)](https://github.com/mapilio/mobile-apps/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/chris-debian/COVERAGE_GIST_ID/raw/mapilio-coverage.json)](https://github.com/mapilio/mobile-apps/actions/workflows/ci.yml)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2052-000020?logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.76.9-61dafb?logo=react)](https://reactnative.dev)
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

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Expo SDK 52 (Bare Workflow) |
| Runtime | React Native 0.76.9 |
| Navigation | React Navigation v7 |
| State | Redux 5 + Redux-Persist |
| Maps | MapLibre React Native |
| Database | expo-sqlite |
| File system | expo-file-system (adapter: `util/fs.js`) |
| Camera | expo-camera |
| Location | expo-location |
| Notifications | OneSignal + expo-sensors |
| Monitoring | Sentry |
| Testing | Jest 29 + jest-expo |

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | 20 LTS |
| npm | 10+ |
| Expo CLI | `npm i -g expo-cli` |
| Xcode | 15+ (iOS only) |
| Android Studio | Giraffe+ (Android only) |
| CocoaPods | 1.14+ (iOS only) |

> **macOS + nvm users:** After switching Node versions run `ln -s $(which node) /usr/local/bin/node` so Xcode build scripts can find Node.

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/mapilio/mobile-apps.git
cd mobile-apps
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.development
```

Open `.env.development` and fill in your credentials (see [Environment Variables](#environment-variables) below).

### 3. iOS (macOS only)

```bash
cd ios && pod install && cd ..
npx expo run:ios
```

### 4. Android

```bash
npx expo run:android
```

### Rebuild native layers after dependency changes

```bash
# iOS
npx expo prebuild -p ios --clean && cd ios && pod install && cd ..

# Android
npx expo prebuild -p android --clean
```

---

## Environment Variables

Copy `.env.example` to `.env.development` (local dev) or `.env.production` (release builds) and supply real values. **Never commit real credentials.**

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_SERVICE_URL` | Mapilio REST API base URL |
| `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` | MapLibre/Mapbox public token |
| `EXPO_PUBLIC_AUTH_CLIENT_ID` | OAuth2 client ID |
| `EXPO_PUBLIC_AUTH_CLIENT_SECRET` | OAuth2 client secret |
| `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` | Google Sign-In iOS client ID |
| `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` | Google Sign-In Android client ID |
| `EXPO_PUBLIC_SENTRY_DSN` | Sentry DSN for error reporting |
| `EXPO_PUBLIC_ONESIGNAL_APP_ID` | OneSignal app ID for push notifications |

See `.env.example` for the full list.

> **iOS + Mapbox:** Create `~/.netrc` if it does not exist and add your Mapbox token:
> ```
> machine api.mapbox.com
> login mapbox
> password sk.ey...your_secret_token
> ```

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

The test suite covers reducers, helper functions, and the file-system adapter (~235 tests).

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

Copyright 2024–2026 Mapilio
