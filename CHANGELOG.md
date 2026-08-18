# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Version `1.2.1` is the repository configuration baseline. The public repository launch does not imply a `2.0` store or API release; EAS continues to manage production build numbers remotely.

---

## [Unreleased]

### Added

- `SECURITY.md` — responsible disclosure policy using GitHub private advisory reporting (PR #36)
- `CODE_OF_CONDUCT.md` — references Contributor Covenant v2.1; enforcement contact added (PRs #31, #53)
- `CONTRIBUTING.md` — AI-assisted contributions policy and Apache 2.0 licence section (PR #51)
- ESLint baseline configuration and CI enforcement step (PR #37)
- Needs-assignee label automation (PR #33)
- README badges: platform, PRs Welcome, OpenStreetMap (PR #52)

### Fixed

- SQL injection vulnerability in `helper/upload.js` — parameterised query replaces string interpolation (PR #27)
- Skeleton loading crash — custom `Skeleton.js` backed by `expo-linear-gradient` replaces broken `react-native-skeleton-placeholder` dependency (PR #49)
- Duplicate style keys in `styles/leaderStyles.js` flagged by ESLint `no-dupe-keys` (PR #38)
- Copy typos and inconsistencies in `translations/en.json` (PR #35)
- Camera angle modal copy corrected in `translations/en.json` (PR #30)
- GPS accuracy modal now shows a live accuracy value (PR #34)
- Upload screen shows "Calculating…" instead of "0MB" while size is resolving (PR #32)
- CI workflow aligned to `main` branch; `console.log` removed from production code (PR #29)
- `react/jsx-no-undef` errors resolved — missing imports added, dead component removed (PR #42)
- `no-undef` ESLint errors resolved across 6 files (PR #43)

### Changed

- Licence updated to Apache 2.0
- `actionsName.js` and `actionsName.ts` consolidated into a single TypeScript file (PR #44)

---

## Pre-open-source history

This project was developed as a closed-source product prior to its open source launch. Retained, security-sanitized history is available through `git log`. This changelog documents changes from the point of open source development onwards.
