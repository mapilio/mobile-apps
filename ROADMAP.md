# Mapilio Mobile Roadmap

Mapilio Mobile is an iOS and Android app for capturing street-level imagery for
the Mapilio and OpenStreetMap ecosystem. This file keeps release scope
deliberately small and does not assign dates or promises.

## Public source release

The current retained asset inventory contains 126 records, all recorded as
having verified redistribution rights. The remaining source-publication gate is
the controlled rewrite of the existing repository's sensitive history:

- Revoke or rotate the superseded Sentry, Mapbox, and MapTiler credentials.
- Freeze writes and repeat the accepted path-scoped `git-filter-repo` procedure
  against a fresh exact mirror of every live ref.
- Preserve every ref name in the local rewrite mirror, preserve all branch/tag
  names remotely, and keep the byte-identical approved `main` tree while
  requiring a zero-finding all-history scan and clean Git object database.
- Force-push the rewritten branches and tags, then complete GitHub Support
  dereferencing of affected pull-request refs/caches and require fresh clones.
- Restore and verify CI, access, branch protections, rules, secret scanning,
  push protection, and private vulnerability reporting before public visibility.

Signed builds, legal approval, social-provider rollout, accessibility,
Marketplace validation, test expansion, announcements, and general cleanup do
not block publication of the approved source snapshot unless they uncover a
credential, security, licensing, or supported-build risk.

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
- A restricted backup and clean-root fallback exist, but the selected release
  path preserves the canonical repository with sanitized history. The accepted
  dry run reached zero findings without changing the approved current tree.

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

The latest verified iOS simulator pass covers cold launch, password login,
refresh, map rendering, simulated location, leaderboard, contributor and own
profiles, feed detail, profile settings, localization/RTL switching, and
sign-out. Simulator evidence does not replace signed artifacts or
physical-device checks.

## After the repository is public

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
