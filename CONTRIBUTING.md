# Contributing to Mapilio Mobile

Thank you for your interest in contributing! This document covers everything you need to get started.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Development Setup](#development-setup)
- [Branching Strategy](#branching-strategy)
- [Making a Pull Request](#making-a-pull-request)
- [Commit Messages](#commit-messages)
- [Code Style](#code-style)
- [Testing](#testing)

---

## Code of Conduct

Be respectful and constructive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

---

## Reporting Bugs

1. Search [existing issues](../../issues) to avoid duplicates.
2. Open a new issue and include:
   - Device model and OS version
   - App version (from `app.json`)
   - Steps to reproduce
   - Expected vs actual behaviour
   - Relevant logs or screenshots

---

## Suggesting Features

Open an issue with the **enhancement** label. Describe the use case, not just the solution.

---

## Development Setup

```bash
git clone https://github.com/mapilio/mapilio-mobile-apps.git
cd mapilio-mobile-apps
npm install

# Copy environment template
cp .env.example .env.development
# Fill in your credentials in .env.development

# iOS
cd ios && pod install && cd ..
npx expo run:ios

# Android
npx expo run:android
```

See [README.md](README.md) for full prerequisites.

---

## Branching Strategy

| Branch           | Purpose                       |
| ---------------- | ----------------------------- |
| `main`           | Stable, production-ready code |
| `expo`           | Expo SDK migration work       |
| `feature/<name>` | New features                  |
| `fix/<name>`     | Bug fixes                     |
| `chore/<name>`   | Tooling, deps, CI changes     |

Branch off `main` for all new work unless instructed otherwise.

---

## Making a Pull Request

1. Fork the repository and create your branch from `main`.
2. Make your changes — keep PRs focused (one concern per PR).
3. Add or update tests for any changed logic.
4. Ensure formatting passes: `npm run format:check`
5. Ensure lint passes: `npm run lint`
6. Ensure all tests pass: `npm run test:ci`
7. Ensure TypeScript compiles: `npx tsc --noEmit`
8. Push your branch and open a PR against `main`.
9. Fill in the PR template (description, test plan, screenshots if UI).

PRs that fail CI will not be merged.

---

## Commit Messages

Write a short, natural summary of the change. Prefixes such as `feat:` and `docs:` are not required.

**Examples:**

```
Add burst capture mode
Retry uploads after a 503 response
Update expo-camera to 16.0.18
Cover the camera reducer reset behavior
```

- Use the imperative mood ("add", not "added" or "adds").
- Keep the summary under 72 characters.
- Reference issues in the body: `Closes #42`.

---

## Code Style

- **JavaScript/TypeScript/JSON/Markdown/YAML** — format with Prettier before opening a PR:
  `npm run format`
- Run `npm run format:check` to verify that maintained files are formatted without changing them.
- **Imports** — group: React → React Native → third-party → local, separated by a blank line.
- **No commented-out code** — delete dead code; use version control to recover it.
- **No `console.log`** in production paths — use the Sentry integration for error reporting.
- **New files** — prefer `.ts`/`.tsx`; the codebase is incrementally migrating from `.js`.

---

## Testing

The project uses Jest with the `jest-expo` preset.

```bash
npm run test:ci          # Run all tests once (CI mode)
npm test                 # Watch mode for local development
npm run test:ci -- --coverage   # With coverage report
```

**Requirements for PRs:**

- New utility functions and reducers **must** have unit tests.
- Tests live in `__tests__/` mirroring the source path (e.g. `helper/foo.js` → `__tests__/helper/foo.test.js`).
- Do not use `jest.mock` to mock the module under test — only mock its external dependencies.
- Reducers must test: initial state, each action type, immutability, and unknown action fallback.

---

## Adding a New Dependency

Before adding a package:

1. Check it supports **Expo SDK 52** and **React Native 0.76.9**.
2. Check it works with the **New Architecture** (`newArchEnabled=true`) or document the blocker.
3. Prefer packages that work without native module changes (pure JS or Expo modules).
4. Update `README.md`'s Tech Stack table if it's a significant addition.

---

## AI-Assisted Contributions

AI tools (such as Claude, Copilot, etc.) are welcome to use when preparing contributions. The submitting contributor is responsible for:

- Reviewing and understanding all AI-generated output before opening a PR
- Testing the changes locally before submitting
- Ensuring all contributions are submitted under the project's [Apache 2.0 licence](LICENSE)

The AI is a tool — the contributor is accountable for the quality of what is submitted.

---

## Licence

By contributing, you agree that your contributions will be licensed under the [Apache License, Version 2.0](LICENSE).
