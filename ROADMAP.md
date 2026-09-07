# Mapilio Mobile Roadmap

Mapilio Mobile is an iOS and Android app for capturing street-level imagery for
the Mapilio and OpenStreetMap ecosystem. This file keeps release scope
deliberately small and does not assign dates or promises.

## Public source release

The repository is public as of 2026-09-07. Asset-rights verification, sensitive
history cleanup, GitHub Support ref cleanup, and public-clone checks are
complete. Repository protections and security reporting are enabled, and
workflow actions are pinned. See [PR #143](https://github.com/mapilio/mobile-apps/pull/143).

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
  Map recentering did not respond and capture remained on a loading screen;
  diagnosis is still open. This read-only smoke did not verify refresh,
  sign-out, real capture, or upload/retry.
- Follow-up fixes request the correct camera/location permissions and recenter
  immediately on an existing GPS fix. The focused regression suite passes
  (29 tests). Simulator confirmation is still pending; these results do not
  close the capture or store-release checks.

## Store and operational release

These items matter for operational rollout or signed App Store and Google Play
releases, but do not keep the source repository private:

- Record Mapilio's legal approval of the current Privacy Policy and Terms, then
  verify every policy, support, and deletion link in release builds.
- Smoke-test Google, Facebook, Apple, and OpenStreetMap against the deployed
  backend-first exchange, then rotate superseded credentials through the
  installed-build adoption plan.
- Produce signed AAB and IPA evidence, verify ELF and 16 KB compatibility on the
  signed Android artifact, and complete the supported physical-device matrix.
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
- Add capture, grouped-upload, interruption, retry, and completion coverage.
- Complete the backend processing-status contract before implementing its
  mobile UI.
- Expand Marketplace tests and staging evidence.
- Decide whether to offer an optional Meta-free build.
- Finalize the OSM community announcement after its factual claims are reviewed.

Priorities can change, but new work must not be promoted into the public-source
gate without a concrete publication risk.
