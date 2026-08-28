# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Version `1.2.1` is the repository configuration baseline. The public repository launch does not imply a `2.0` store or API release; EAS continues to manage production build numbers remotely.

---

## [Unreleased]

### Added

- `SECURITY.md` — responsible disclosure policy using GitHub private vulnerability reporting
- `CODE_OF_CONDUCT.md` — references Contributor Covenant v2.1; enforcement contact added
- `CONTRIBUTING.md` — AI-assisted contributions policy and Apache 2.0 licence section
- ESLint baseline configuration and CI enforcement step
- Needs-assignee label automation
- README badges: platform, PRs Welcome, OpenStreetMap

### Fixed

- SQL injection vulnerability in `helper/upload.js` — parameterised query replaces string interpolation
- Skeleton loading crash — custom `Skeleton.js` backed by `expo-linear-gradient` replaces broken `react-native-skeleton-placeholder` dependency
- Duplicate style keys in `styles/leaderStyles.js` flagged by ESLint `no-dupe-keys`
- Copy typos and inconsistencies in `translations/en.json`
- Camera angle modal copy corrected in `translations/en.json`
- GPS accuracy modal now shows a live accuracy value
- Upload screen shows "Calculating…" instead of "0MB" while size is resolving
- CI workflow aligned to `main` branch; `console.log` removed from production code
- `react/jsx-no-undef` errors resolved — missing imports added, dead component removed
- `no-undef` ESLint errors resolved across 6 files

### Changed

- Licence updated to Apache 2.0
- `actionsName.js` and `actionsName.ts` consolidated into a single TypeScript file

---

## Pre-open-source history

This project was developed as a closed-source product prior to its open source
launch. Before publication, affected history is sanitized with a path-scoped
rewrite that preserves the current source tree but changes descendant commit
hashes. A restricted pre-rewrite backup is retained for recovery and must never
be pushed into the cleaned public repository. This changelog documents the
public baseline and subsequent changes.
