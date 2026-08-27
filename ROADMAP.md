# Mapilio Mobile Roadmap

Mapilio Mobile is an iOS and Android app for capturing street-level imagery for
the Mapilio and OpenStreetMap ecosystem. GitHub issues are the source of truth
for current work; this file keeps release scope deliberately small.

## Public source release

The repository stays private until these two source-publication gates are complete:

- [#99](https://github.com/mapilio/mobile-apps/issues/99): merge the prepared
  removal of the 27 unclear-provenance or third-party visual assets after the
  iOS Simulator presentation check. The retained inventory then contains only
  verified Mapilio families and Poppins under OFL-1.1.
- [#83](https://github.com/mapilio/mobile-apps/issues/83): publish the current
  clean tree as a new single-commit public repository, keep the existing
  history in a private archive, and pass current-tree secret scanning before
  changing visibility. No old branch, tag, pull-request ref, or Git object is
  copied into the public repository.

[#84](https://github.com/mapilio/mobile-apps/issues/84) remains an operational
security and binary-rollout gate, but no longer blocks publishing a clean source
snapshot: the current mobile tree does not ship the superseded client secrets.

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
- The existing private history has a redacted audit and remains available as a
  restricted archive; the public repository starts from a clean snapshot.

## Store release

These items matter for signed App Store and Google Play releases, but do not keep
the source repository private:

- [#4](https://github.com/mapilio/mobile-apps/issues/4) and
  [#10](https://github.com/mapilio/mobile-apps/issues/10): final legal check of
  the current Privacy Policy and Terms, followed by release-build link checks.
- [#84](https://github.com/mapilio/mobile-apps/issues/84): verify Google,
  Facebook, Apple, and OpenStreetMap against the deployed backend-first exchange,
  then rotate the superseded credentials using the binary adoption plan.
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

- [mapilio/backend#70](https://github.com/mapilio/backend/issues/70): optimize
  `/api/user-uploads-v2` for high-volume contributors. The latest modern-backend
  canary check completed successfully but took about nine seconds.
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
