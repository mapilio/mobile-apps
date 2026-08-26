# Mapilio Mobile Roadmap

Mapilio Mobile is an iOS and Android app for capturing street-level imagery for
the Mapilio and OpenStreetMap ecosystem. GitHub issues are the source of truth
for current work; this file keeps release scope deliberately small.

## Public source release

The repository stays private until these three issues are complete:

- [#83](https://github.com/mapilio/mobile-apps/issues/83): rotate or revoke
  historical credentials, publish sanitized history, and pass a redacted
  all-refs secret scan with no unexplained findings.
- [#84](https://github.com/mapilio/mobile-apps/issues/84): deploy the backend-first
  social-login exchange, verify Google, Facebook, Apple, and OpenStreetMap in
  production, then rotate the superseded credentials.
- [#99](https://github.com/mapilio/mobile-apps/issues/99): confirm redistribution
  rights for every remaining bundled asset family, or replace/remove assets whose
  rights cannot be demonstrated.

No accessibility, Marketplace, test-coverage, announcement, or general cleanup
issue blocks source visibility unless it uncovers a credential, security,
licensing, or supported-build risk.

## Ready foundation

- The project uses Expo 57, React Native 0.86, and MapLibre React Native 11.
- Password login, refresh, profile, leaderboard, feed detail, and the modern API
  compatibility path have passed iOS simulator checks.
- MapLibre's original New Architecture GPS crash has been fixed and the first
  real Android GPS fix was confirmed without a crash on physical hardware.
- Localization fallback, persisted device language, and Arabic RTL switching are
  implemented and tested.
- CI covers formatting, TypeScript, Jest, dependency auditing, bundle smoke tests,
  asset inventory, and incremental secret scanning.
- A safe full-history audit and publication runbook exist; running the approved
  credential rotation and history-remediation operation remains open in #83.

## Store release

These items matter for signed App Store and Google Play releases, but do not keep
the source repository private:

- [#4](https://github.com/mapilio/mobile-apps/issues/4) and
  [#10](https://github.com/mapilio/mobile-apps/issues/10): owner/legal approval of
  the current Privacy Policy and Terms, followed by release-build link checks.
- [#74](https://github.com/mapilio/mobile-apps/issues/74): signed AAB/IPA evidence,
  ELF and 16 KB verification on the signed Android artifact, and the supported
  physical-device matrix.
- Physical Android and iOS checks for camera, real GPS, permissions,
  background/resume, removable storage, notifications, capture, upload/retry, and
  destructive account actions.

## Recurring modern API check

Run the app against the modern backend after changes to authentication, transport,
API contracts, maps, profiles, feeds, Marketplace, capture, or upload, and once
more from each release candidate. Record the mobile/backend commit, simulator or
device, API environment, and pass/fail result. Use isolated staging with disposable
data for writes and destructive actions.

The latest verified iOS simulator pass covers cold launch, password login, refresh,
map rendering, simulated location, leaderboard, contributor and own profiles, feed
detail, profile settings, localization/RTL switching, and sign-out. Simulator
evidence does not replace signed artifacts or physical-device checks.

## After the repository is public

- Complete accessibility work in #87 and #124, including PR #111, with
  TalkBack/VoiceOver verification.
- Add capture, grouped-upload, interruption, retry, and completion coverage in #94.
- Complete the backend processing-status contract before implementing mobile #73.
- Expand Marketplace tests and staging evidence without delaying source release.
- Decide on the optional Meta-free build in #72.
- Finalize the OSM community announcement in #95 after the public-source gates are
  complete and its factual claims are reviewed.

Priorities can change, but new work must not be promoted into the public-source
gate without a concrete publication risk.
