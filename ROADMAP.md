# Mapilio Mobile Roadmap

Mapilio Mobile is an open-source iOS and Android app for capturing street-level imagery for the Mapilio and OpenStreetMap ecosystem.

This is a direction of travel, not a schedule. GitHub [issues](https://github.com/mapilio/mobile-apps/issues), [milestones](https://github.com/mapilio/mobile-apps/milestones), and [discussions](https://github.com/mapilio/mobile-apps/discussions) are the source of truth for current priorities and decisions. Nothing here is a date or a promise.

## Public repository gates

The repository remains private until maintainers can demonstrate all of the following:

- Privacy Policy and Terms & Conditions have current, approved content and links.
- The [public-release legal review packet](docs/legal/public-release-review.md)
  records preparation evidence for issues #4 and #10; it is not legal approval,
  and the approval gate remains open.
- Historical credentials have been inventoried and rotated, affected Git history has been sanitized, and a redacted all-refs Gitleaks scan has no unexplained findings.
- A pinned secret scan runs on every pull request and push to the default branch.
- Login and refresh use a mobile public-client flow such as Authorization Code with PKCE or a backend exchange; no confidential secret is shipped in the app, and contract tests cover both flows.
- Expo, React Native, and native libraries are on supported versions; release Android and iOS builds pass the full test suite, dependency audit, and an Android 16 KB page-alignment check.
- Production signing credentials are supplied outside the repository, and a release build does not use the tracked Android debug key.
- Prettier is applied to the maintained source tree and enforced in CI.
- Third-party fonts, images, and bundled assets have documented redistribution rights.

## Near term

- Add contract and device-matrix coverage for capture, grouped upload, interruption, retry, and completion without losing local imagery.
- When the API exposes timestamps and failure states, show processing age, delayed-job warnings, terminal failure reasons, and a safe retry or delete action.
- Record the Meta-free build decision in Discussions; if accepted, build that flavor in CI without the Facebook native SDK.
- Audit the map, capture, upload, login, and leaderboard workflows for screen-reader labels, contrast, touch targets, startup time, and list performance, then track concrete failures as issues.

## Longer term

- Document a stable mobile/backend compatibility policy and versioned API contract for third-party capture clients.
- Graduate community integrations only after each has an owner, supported API boundary, tests, and operational documentation.

Priorities may change as implementation, API capabilities, and community feedback evolve. Please use the GitHub links above for discussion and the latest status.
