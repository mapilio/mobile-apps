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

The current visibility blockers are tracked in issues #4, #10, #74, #83, #84,
#99, and #120. Near-term accessibility, localization, coverage, Marketplace,
processing-status, optional-distribution, and launch-communications work remains
important, but does not by itself keep source code private. A known finding moves
back into this gate only when it exposes a legal, credential, security, signing,
asset-rights, or supported-build risk.

## Recurring modern API simulator gate

This is a continuing compatibility check, not a one-time migration task. Run the
mobile app against the modern backend in a supported iOS simulator:

- after any mobile or backend change to authentication, API transport, endpoint
  contracts, maps, profile/feed, Marketplace, capture, or upload;
- before merging a release candidate and again from the exact merged `main`
  revisions; and
- after dependency/native upgrades or a change to the configured API base URL.

Each run must record the mobile and backend commit SHAs, simulator model/runtime,
API base URL/environment, date, tester, pass/fail per workflow, and linked failure
issues. The minimum smoke matrix is cold launch/config, password login, token
refresh or re-authentication, authenticated map and tiles, simulated location and
follow mode, leaderboard, another contributor's profile, own profile and grouped
feed detail, Marketplace list/detail, profile settings, and sign-out. Capture,
upload, account writes, Marketplace application, and destructive actions use only
an approved isolated staging environment with disposable data.

Simulator evidence never replaces physical-device GPS, camera, permission,
background/resume, removable-storage, notification, upload-retry, signed-build,
or store-artifact checks. This Mac currently has Xcode but no installed iOS
simulator runtime; installing a supported runtime and restoring this recurring
gate is the first open environment action. Until then, no new simulator result may
be claimed from this machine.

## Near term

- Resolve the localization architecture in #122: add an English fallback, select a
  supported device locale on first launch, define persisted-locale migration, and
  implement and test RTL direction for Arabic. PR #121 is a useful single-source
  cleanup, but must preserve previously loaded locale resources such as Romanian
  before it can merge.
- Complete the accessibility work in #87 and #124 across login, map, Marketplace,
  leaderboard, capture, and upload. PR #111 covers the Marketplace and leaderboard
  icon controls, but still needs a clean current-`main` CI run and TalkBack/VoiceOver
  smoke evidence. Add discoverable alternatives for long-press and swipe-only
  actions, roles, labels, state, and minimum touch targets.
- Add component and contract coverage in #94 for capture, grouped upload,
  interruption, cancellation, retry, and completion without losing local imagery.
  Keep camera, GPS, filesystem, removable-storage, background/resume, and network
  failure checks in a separate physical-device matrix.
- Finish the server contract in backend #56 before implementing mobile #73. Reuse
  the existing `fail` status, expose a processing-start timestamp and safe failure
  reason, preserve older-client behavior, then test age, warning, retry, and delete
  states in the app.
- Add a Marketplace test track covering anonymous GeoJSON load, coordinate sorting,
  map polygons, empty/error/loading states, authenticated job application, duplicate
  application, distance/equipment rules, capture hand-off, and accessibility. The
  modern backend's isolated Marketplace and project-job contract suite currently
  passes 14 tests / 56 assertions; mobile screen/API and real staging apply evidence
  remain open.

## Longer term

- Record the Meta-free build decision from #72 in Discussions; if accepted, build
  that flavor in CI without the Facebook native SDK and prove the package/plugin is
  absent from both native artifacts.
- Finalize and approve the OSM community announcement in #95 only after every public
  repository gate is green. Verify all project-history, licensing, imagery, and
  contribution claims before publishing it.
- Document a stable mobile/backend compatibility policy and versioned API contract for third-party capture clients.
- Graduate community integrations only after each has an owner, supported API boundary, tests, and operational documentation.

Priorities may change as implementation, API capabilities, and community feedback evolve. Please use the GitHub links above for discussion and the latest status.
