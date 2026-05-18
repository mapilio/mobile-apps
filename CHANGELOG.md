# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows the scheme agreed in [issue #3](https://github.com/mapilio/mobile-apps/issues/3) — this file will be updated once the version number for the first open source release is decided.

---

## [Unreleased]

### Added

- `SECURITY.md` — responsible disclosure policy using GitHub private advisory reporting
- `CODE_OF_CONDUCT.md` — references Contributor Covenant v2.1
- Jest coverage reporting with README badge (PR #46)
- ESLint baseline configuration and CI enforcement step (PR #37)
- Needs-assignee label automation (PR #33)

### Fixed

- SQL injection vulnerability in `helper/upload.js` — parameterised query replaces string interpolation (PR #27)
- Duplicate style keys in `styles/leaderStyles.js` flagged by ESLint `no-dupe-keys` (PR #38)
- Copy typos and inconsistencies in `translations/en.json` (PR #35)
- Camera angle modal copy corrected in `translations/en.json` (PR #30)
- GPS accuracy modal now shows a live accuracy value (PR #34)
- Upload screen shows "Calculating…" instead of "0MB" while size is resolving (PR #32)
- CI workflow aligned to `main` branch; `console.log` removed from production code (PR #29)
- `react/jsx-no-undef` errors resolved — missing imports added, dead component removed (PR #42)
- `no-undef` ESLint errors resolved across 6 files (PR #43)
- `react-native-snap-carousel` replaced with `react-native-pager-view` — removes abandoned dependency and its associated vulnerability (PR #40)

### Changed

- Licence updated to Apache 2.0

---

## Pre-open-source history

This project was developed as a closed-source product prior to its open source launch. Full commit history is available via `git log`. This changelog documents changes from the point of open source development onwards.
