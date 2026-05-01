# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

**Mapilio Mobile** is a street-level imagery capture app (iOS + Android) built with Expo SDK 52 (bare workflow) and React Native 0.76.9. Chris is leading the open source effort; Ozcan (Mapilio team lead) reviews and merges PRs. The repo is currently private while being cleaned up before public launch.

- **GitHub repo**: https://github.com/mapilio/mobile-apps (private)
- **Roadmap/todo**: `/home/chris/dev/personal-todo/Mapilio/roadmap_and_todo_list.md`
  - Always read this file before suggesting work — it is the authoritative task list
  - Never WebFetch Codeberg to read this file; read it directly from disk

## Authentication

**GitHub CLI (`gh`) is already authenticated** — use it directly for all GitHub operations (issues, PRs, comments). No login step needed.

**Codeberg** (personal-todo repo) — never WebFetch Codeberg URLs; the repo is private and Codeberg intentionally returns garbled content to scrapers. Read roadmap files directly from disk at `/home/chris/dev/personal-todo/`.

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

# ESLint (once PR #37 is merged)
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
git -C /home/chris/dev/mapilio branch
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

## Current State (as of 2026-05-01)

### Open PRs (15 total — all awaiting Ozcan's review)
| PR | Branch | Addresses |
|----|--------|-----------|
| #27 | fix/sql-injection-upload-js | Issue #2 |
| #29 | fix/ci-branch-and-console-logs | Issue #20 |
| #30 | fix/camera-angle-modal-copy | Issue #12 |
| #31 | fix/add-code-of-conduct | Issue #8 |
| #32 | fix/upload-size-calculating | Issue #11 |
| #33 | chore/needs-assignee-automation | — |
| #34 | fix/gps-accuracy-modal | Issue #13 |
| #35 | fix/copy-typos | — |
| #36 | docs/add-security-md | Issue #7 |
| #37 | chore/add-eslint-config | Issue #21 |
| #38 | fix/dupe-keys-eslint | — |
| #40 | fix/replace-snap-carousel | Issue #19 |
| #42 | fix/jsx-no-undef-missing-imports | — |
| #43 | fix/no-undef-missing-globals | — |
| #44 | refactor/consolidate-actionsName | Issue #24 |
| #46 | chore/jest-coverage-badge | Issue #26 |

### Pending maintainer actions (blocked — cannot proceed without Ozcan)
- **Coverage badge** (PR #46): Ozcan needs to create a GitHub Gist, add `GIST_SECRET` and `COVERAGE_GIST_ID` repo variables. README badge URL contains placeholder `COVERAGE_GIST_ID`.
- **CI branch target**: CI currently runs on `master`/`expo` push + `master` PR. If `main` is the real default branch, the workflow needs updating. Confirm with Ozcan.

### Notable open issues (not yet addressed by any PR)
- #45 — Replace MapTiler with OpenFreeMap (requires Ozcan sign-off; issue raised, awaiting response)
- #22 — Add Prettier
- #6 — Facebook credentials hardcoded in `app.json` (security)
- #4, #10 — Privacy Policy / T&C review (legal; needs Ozcan)
- #3 — Version number for first open source release

## Testing

Coverage is collected from: `helper/**/*.js`, `store/reducers/**/*.js`, `util/fs.js`, `util/helpers/**/*.js`. Threshold: 15% line coverage (intentionally low — test suite is in early stages).

Test files live in `__tests__/`. Mocks in `__tests__/__mocks__/`.
