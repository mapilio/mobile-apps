# Mapilio Mobile Roadmap

Mapilio Mobile is an iOS and Android app for capturing street-level imagery for
the Mapilio and OpenStreetMap ecosystem. This file keeps release scope
deliberately small and does not assign dates or promises.

## Public source release

The repository is public as of 2026-09-07. Asset-rights verification, sensitive
history cleanup, GitHub Support ref cleanup, and public-clone checks are
complete. Repository protections and security reporting are enabled, and
workflow actions are pinned. See [PR #143](https://github.com/mapilio/mobile-apps/pull/143).

Chris published the community announcement on 2026-09-22 to the OSM forum,
talk@openstreetmap.org and Mapilio's Discord, as recorded in
[#95](https://github.com/mapilio/mobile-apps/issues/95#issuecomment-5780308201).

Source publication is separate from an App Store or Google Play release. The
remaining store, legal, provider, and physical-device work is tracked below.

## Ready foundation

- The project uses Expo 57, React Native 0.86, and MapLibre React Native 11.
- Password login, refresh, profile, leaderboard, feed detail, and the modern API
  compatibility path have passed iOS simulator checks.
- MapLibre's original New Architecture GPS crash has been fixed and the first
  real Android GPS fix was confirmed without a crash on physical hardware.
- Localization fallback, persisted device language, and Arabic RTL switching
  are implemented and tested.
- CI covers formatting, TypeScript, Jest, dependency auditing, bundle smoke
  tests, asset inventory, and incremental secret scanning.
- The current manifest records verified rights for all 126 retained asset
  records.
- On 2026-09-07, mobile `63bd14a` JavaScript ran against backend `5aa58cca` on
  iPhone 17 / iOS 26.4 using a cached development build with matching native
  sources and dependency locks. Login, leaderboard, contributor and own
  profiles, feed maps/photos, policy pages, and the empty upload screen passed.
- Follow-up fixes in [PR #144](https://github.com/mapilio/mobile-apps/pull/144)
  passed 29 focused tests and a fresh iOS simulator replay: the location button
  centers on an existing fix, repeated taps keep following enabled, camera
  permission is requested, denial stays outside capture, and allowed capture
  opens after physical landscape rotation and exits to Upload.
  Refresh, sign-out, real capture, and upload/retry were not verified in this
  read-only run. These results do not replace physical-device or store checks.
- The 2026-09-08 follow-up for [PR #145](https://github.com/mapilio/mobile-apps/pull/145)
  verified capture entry, the portrait waiting-screen exit, foreground GPS
  recovery, and direct Upload-to-Capture re-entry on the same iOS simulator and
  modern backend. Small-capture exit now resets the camera route so an old
  screen cannot restore portrait orientation over the next capture session.
  No imagery was recorded or uploaded in this check.

## Store and operational release

These items matter for operational rollout or signed App Store and Google Play
releases, but do not keep the source repository private:

- Play organization verification is complete: on 2026-09-23 the account policy
  page reported no developer-account issues. App policy review is separate;
  official account records remain private.
- Correct the published Android version's Data safety declaration. The
  2026-09-23 submission attempt failed Google's quick checks: Device or other
  IDs are still undeclared for version 69. Data safety and Health apps changes
  returned to "not yet submitted"; neither is approved or published.
  The [source-to-category mapping](docs/legal/public-release-review.md#google-play-data-safety-correction)
  remains evidence for reconciling the shipped build, not proof of its behavior.
  [#4](https://github.com/mapilio/mobile-apps/issues/4) is closed; keep outstanding
  declaration results and signed-build policy, support and deletion-link checks
  with the existing release work in [#74](https://github.com/mapilio/mobile-apps/issues/74).
- Verify Google/Facebook account deletion end to end in
  [#164](https://github.com/mapilio/mobile-apps/issues/164). The app now sends
  provider-specific requests, with fresh Google authorization and no default
  fallback on provider failure. [Backend #179](https://github.com/mapilio/backend/pull/179)
  must be deployed and configured first. Disposable-account provider checks on
  both platforms remain open; mocked tests are not a live revocation pass.
- Smoke-test Google, Facebook, Apple, and OpenStreetMap against the deployed
  backend-first exchange, then rotate superseded credentials through the
  installed-build adoption plan.
- Produce signed AAB and IPA evidence, verify ELF and 16 KB compatibility on the
  signed Android artifact, and complete the supported physical-device matrix.
- The 2026-09-23 iPhone 17 / iOS 26.4 replay caught and fixed a fullscreen-photo
  exit crash: the modal's landscape-only mask conflicted with the portrait lock
  during dismissal. The viewer now accepts both orientations, restores portrait
  on close/unmount, handles Android back, and measures its own safe area so the
  previous-photo control clears the notch. Against modern backend `9466de6`, a
  209-photo feed, route, thumbnails, fullscreen images, next/previous navigation
  and return to portrait worked. This used a fresh JS bundle in the existing
  development native build; Android back is component-tested, not a new device pass.
- Feed photo reports now receive the selected image ID in both embedded and
  fullscreen views. The old prop mismatch omitted `imagery_id`. Regression tests
  cover changing photos, the nested request payload, cancellation and failures;
  no test complaint was submitted to the production service.
- Feed-detail empty responses and failed requests now have a retry path in the
  pending app change: preserve `data: null` as an empty feed, show the existing
  localized error, and pull to refresh. Component tests cover both request
  failures and stale responses. Simulator verification of empty/error/retry and
  the normal photo flow is still required before merging this UI change.
- Complete physical Android and iOS checks for camera, real GPS, permissions,
  background/resume, removable storage, notifications, capture, upload/retry,
  and destructive account actions.
- Complete TalkBack and VoiceOver accessibility verification and remediate the
  resulting findings.

## Recurring modern API check

Run the app against the modern backend after changes to authentication,
transport, API contracts, maps, profiles, feeds, Marketplace, capture, or
upload, and once more from each release candidate. Record the mobile/backend
commit, simulator or device, API environment, and pass/fail result. Use isolated
staging with disposable data for writes and destructive actions.

Earlier iOS simulator checks covered cold launch, password login,
refresh, map rendering, simulated location, leaderboard, contributor and own
profiles, feed detail, profile settings, localization/RTL switching, and
sign-out. The dated check above records the current results and unresolved
observations. Simulator evidence does not replace signed artifacts or
physical-device checks.

## Follow-up work

- [mapilio/backend#70](https://github.com/mapilio/backend/issues/70): optimize
  `/api/user-uploads-v2` for high-volume contributors. The latest modern-backend
  canary check completed successfully but took about nine seconds.
- Keep focused regression tests with capture/upload fixes; the broad coverage
  umbrella [#94](https://github.com/mapilio/mobile-apps/issues/94) is closed as
  not planned. Real capture, grouped upload and interruption/retry checks remain
  part of the device work in [#74](https://github.com/mapilio/mobile-apps/issues/74)
  and [#104](https://github.com/mapilio/mobile-apps/issues/104).
- Complete the backend processing-status contract before implementing its
  mobile UI.
- Expand Marketplace tests and staging evidence.
- F-Droid/Meta-free distribution is a later direction, not a current release
  decision. [#72](https://github.com/mapilio/mobile-apps/issues/72) is closed as
  not planned for this release; revisit native SDK exclusion when that work starts.
- Panorama, drone integration, Marketplace, refreshed interfaces and scoring
  remain future product work, separate from the current store-release scope.

Priorities can change, but new work must not be promoted into the public-source
gate without a concrete publication risk.
