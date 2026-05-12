# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

**Mapilio Mobile** is a street-level imagery capture app (iOS + Android) built with Expo SDK 52 (bare workflow) and React Native 0.76.9. Chris is leading the open source effort; Ozcan (Mapilio team lead) reviews and merges PRs. The repo is currently private while being cleaned up before public launch.

- **GitHub repo**: https://github.com/mapilio/mobile-apps (private while pre-launch cleanup is in progress)

## Authentication

**GitHub CLI (`gh`) is already authenticated** — use it directly for all GitHub operations (issues, PRs, comments). No login step needed.

**npm** — `npm ci` installs dependencies. No authentication required for public packages.

## Commands

```bash
# Install dependencies
npm ci

# Start dev server
npm start                   # Expo dev server
npm run android             # Run on Android
npm run ios                 # Run on iOS

# Tests
npm test                    # Jest watch mode (interactive)
npm run test:ci             # Jest CI mode with coverage (use this for verification)

# Type checking
npx tsc --noEmit

# ESLint
./node_modules/.bin/eslint .          # Check
./node_modules/.bin/eslint . --fix    # Auto-fix
# Note: use ./node_modules/.bin/eslint, NOT npx eslint — the system may have a different version
```

**CI runs**: TypeScript check → Jest with coverage → coverage badge update (main only) → PR coverage comment.

## Architecture

Single-package React Native app (bare Expo workflow). Redux for state management. SQLite (via `db.js`) for local storage. No separate backend — uploads go directly to Mapilio's API.

**Key directories:**

| Path | Responsibility |
|---|---|
| `screens/` | Top-level screen components |
| `components/` | Reusable UI components |
| `highordercomponents/` | HOCs — notably `MapView.js` (MapLibre + MapTiler) |
| `store/` | Redux store, actions, reducers |
| `helper/` | API calls, upload logic, auth |
| `util/` | Filesystem helpers, general utilities |
| `navigator/` | React Navigation stack/tab setup |
| `hooks/` | Custom React hooks |
| `translations/` | i18next locale files (31 languages) |
| `__tests__/` | Jest tests (unit + reducer tests) |

**MapView** (`highordercomponents/MapView.js`): Uses MapLibre GL. Map tiles served by MapTiler — API keys come from Redux `config.mapTokens.iosToken` / `androidToken`. Issue #45 proposes migrating to OpenFreeMap (free, no API key). Attribution is currently hardcoded as "© MapTiler".

**ESLint baseline** (as of 2026-05-01): 157 errors, 7867 warnings — this is the known baseline, not a target. New code should be clean; don't fix the whole baseline in one PR.

## Workflow Rules

### Before starting any task
Always run these two commands first to avoid duplicating work already in progress:
```bash
git branch -a
gh pr list --repo mapilio/mobile-apps --state open
```

### Opening GitHub issues
Always open issue bodies with a friendly greeting before the technical content — e.g. "Hi team," or "Hi Ozcan,". The Mapilio team values a warm, collaborative tone.

### Opening PRs and cross-referencing
After every `gh pr create`, always post a comment on the related issue linking to the PR:
```bash
gh issue comment <issue-number> --repo mapilio/mobile-apps --body "PR #<N> has been opened to address this: <pr-url>"
```
The issue is where someone first lands — make the PR visible from both directions.

### One PR per concern
Don't bundle unrelated fixes. Each PR should address one issue or one logical change.

## Current State (as of 2026-05-11)

### Open PRs (10 total — awaiting Ozcan's review)
| PR | Branch | Addresses |
|----|--------|-----------|
| #34 | fix/gps-accuracy-modal | Issue #13 |
| #40 | fix/replace-snap-carousel | Issue #19 |
| #43 | fix/no-undef-missing-globals | — |
| #46 | chore/jest-coverage-badge | Issue #26 |
| #47 | chore/add-claude-md | — |
| #49 | fix/skeleton-build-error | — |
| #50 | docs/add-changelog | Issue #9 |
| #51 | docs/add-contributing | Issue #1 |
| #52 | docs/readme-badges | Issue #14 |
| #53 | docs/code-of-conduct-contact | Issue #8 follow-up |

### Pending maintainer actions (blocked — cannot proceed without Ozcan)
- **Coverage badge** (PR #46): Ozcan needs to create a GitHub Gist, add `GIST_SECRET` and `COVERAGE_GIST_ID` repo variables. README badge URL contains placeholder `COVERAGE_GIST_ID`.

### Notable open issues (not yet addressed by any PR)
- #45 — Replace MapTiler with OpenFreeMap (requires Ozcan sign-off before PR)
- #22 — Add Prettier
- #6 — Facebook credentials hardcoded in `app.json` (security)
- #4, #10 — Privacy Policy / T&C review (legal; needs Ozcan)
- #3 — Version number for first open source release

## Testing

Coverage is collected from: `helper/**/*.js`, `store/reducers/**/*.js`, `util/fs.js`, `util/helpers/**/*.js`. Threshold: 15% line coverage (intentionally low — test suite is in early stages).

Test files live in `__tests__/`. Mocks in `__tests__/__mocks__/`.
