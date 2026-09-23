# Public-release legal review packet

**Status:** preparation evidence for public and store release review. This
packet is not legal advice and does not grant legal approval. It records
repository evidence and questions for the maintainer and legal owner to decide.

**Evidence snapshot:** 2026-08-19, branch `prepare-legal-release-review`.
Live pages returned HTTP 200 on this date:
[`https://mapilio.com/privacy`](https://mapilio.com/privacy) says "Last modified
on November 15, 2021"; [`https://mapilio.com/terms`](https://mapilio.com/terms)
says "Last modified on July 07, 2023". Recheck live content at release time.

## Current public policy scope

- **Privacy (2021):** live and linked from registration. The page describes
  account, device/usage, service-provider and cookie-related processing and
  provides `info@mapilio.com`; exact app, SDK, transfer, retention and rights
  coverage require owner confirmation against the current build.
- **Terms (2023):** live and linked from registration and profile settings.
  The page states an 18+ rule, identifies the country as the United Kingdom,
  contains a user-content license, privacy-invasive capture restrictions, and
  says Mapilio imagery can be accessed under CC BY-SA. The company legal name,
  address, governing-law wording, license scope, and operational fit still
  require legal-owner decision and production verification.
- The app uses `/privacy` and `/terms` at registration but `/privacy-webview`
  and `/terms-webview` in profile settings. Confirm that both pairs show the
  same current documents before release.

## Data and destination inventory

| Category                      | Collection / trigger                                                                                                                   | Local storage                                                                            | Destination(s)                                                                                  | User control                                                     | Unknown / owner confirmation                                                                                                                                    |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Account and profile           | Registration, login, profile fetch/edit; name, username, email, profile fields and image                                               | Redux-persisted state in AsyncStorage; exact fields to confirm                           | Mapilio REST backend; Sentry user context; OneSignal email/identity flow                        | Edit profile; account-delete UI                                  | Backend fields, lawful basis, provider retention and deletion propagation                                                                                       |
| Auth credentials and tokens   | Email/password or Google, Apple, Facebook, OpenStreetMap sign-in; refresh on 401                                                       | Redux-persisted `auth` and `credential` state in AsyncStorage                            | Mapilio auth endpoints; social provider token is exchanged with Mapilio backend                 | Sign out / account delete UI; provider controls                  | Token expiry, encryption at rest, logs, refresh-token revocation and provider deletion behavior                                                                 |
| Capture image and sequence    | Camera/gallery selection and capture sequence upload                                                                                   | SQLite `captures` metadata plus image file in app document or removable external storage | Mapilio CDN upload, then Mapilio imagery API/backend for processing/publication                 | Review/delete local captures; upload/cancel                      | Backend/CDN retention, backups, publication takedown and third-party imagery handling                                                                           |
| Location and route            | Capture location, reverse-geocode lookup, map/search use                                                                               | SQLite `location` and optional `address`; Redux search history                           | Mapilio imagery API; Photon/search endpoint for reverse geocoding; map/tile services on map use | OS location permission; delete local capture                     | Background/always-on behavior, provider logs, precision reduction and retention                                                                                 |
| EXIF and device metadata      | On upload, parsed from image metadata                                                                                                  | SQLite `exif` JSON until local deletion                                                  | Mapilio imagery API JSON metadata                                                               | Delete local capture before upload; no field-level control shown | Exact public fields, EXIF stripping, device identifier handling and retention                                                                                   |
| Motion and capture telemetry  | Accelerometer/gyroscope values and derived pitch, roll, yaw; speed and accuracy during imagery upload                                  | In local EXIF/metadata record                                                            | Mapilio imagery API JSON metadata                                                               | Capture and OS permission flows                                  | Whether motion is collected continuously, displayed, retained or published                                                                                      |
| Search and map requests       | Search/reverse lookup or map display                                                                                                   | Redux search state/history                                                               | Configured Photon/search URL; OpenFreeMap/OSM or configured road/point tile services            | Avoid search/map; location permission where applicable           | Exact production hosts, request fields, logs, rate limits, licensing and retention                                                                              |
| Diagnostics and notifications | Non-development errors and performance tracing (`tracesSampleRate: 1.0`); notification initialization; user identification after login | SDK-managed local state as applicable                                                    | Sentry; OneSignal; Mapilio identity-verification endpoint                                       | OS notification permission; notification settings                | Sentry transaction fields, network instrumentation, effective sampling, retention, region, opt-out and user association; OneSignal fields, region and retention |
| App updates                   | App startup/update checks through the configured Expo Updates URL                                                                      | Expo Updates SDK-managed cache as applicable                                             | Expo Updates / EAS at `https://u.expo.dev/<EAS_PROJECT_ID>`                                     | App/OS update controls as applicable                             | Exact request fields, device identifiers, production project, region, logs and retention are unknown and require owner confirmation                             |

## Providers, permissions, and upload details

**Configured destinations and integrations:** Mapilio REST API is
`EXPO_PUBLIC_SERVICE_URL`; imagery upload uses the separately configured
`EXPO_PUBLIC_CDN_URL` and then the Mapilio imagery endpoint. Social auth includes
Google, Apple, Facebook and OpenStreetMap, with provider tokens exchanged at
`/api/v1/mobile/auth/social-token`. In non-development builds, Sentry receives
errors and has performance tracing configured with `tracesSampleRate: 1.0`; a
user id/email is associated after profile fetch. Confirm transaction fields,
network instrumentation, effective sampling, retention, region and user
association with the production owner. OneSignal is initialized for
notifications and receives the account email through the identity flow. Expo
Updates / EAS is configured to use
`https://u.expo.dev/<EAS_PROJECT_ID>`; the exact request fields, device
identifiers, production project, region, logs and retention are unknown and
require owner confirmation.
Search uses `EXPO_PUBLIC_SEARCH_API` (the source calls a `/reverse` endpoint,
described operationally as Photon/search). Map rendering uses configured road
and point tile URLs; the UI credits OpenFreeMap and OpenStreetMap, but the
release owner must confirm exact production tile hosts and terms. See
`util/helpers/api/Api.js:6-23`, `util/helpers/api/Cdn.js:7-22`,
`util/helpers/api/Search.js:3-10`, `util/helpers/api/SocialAuth.js:1-7`,
`store/reducers/loginReducer/getUserInformation.js:2-43`, `App.js:50-55`,
`app.config.js:15-18`, `app.config.js:131-134`, `config/tileConfig.js:1-36`, and
`highordercomponents/MapView.js:31`.

**Declared or requested permissions:** camera, microphone/audio, fine and
coarse location, internet, photo library, iOS location-when-in-use/always,
notifications, and iOS motion usage text are present in configuration or
native declarations. The runtime capture helper requests camera and location;
gallery access requests the iOS photo library. Confirm the final iOS and
Android manifests, store disclosures, background-location behavior, and
whether microphone/motion are actually used in the release build. Evidence:
`app.config.js:20-92`, `android/app/src/main/AndroidManifest.xml:2-16`,
`ios/Mapilio/Info.plist:65-103`, and `helper/helper.js:55-110`.

**Imagery and metadata:** a mobile upload sends the JPEG and account email to
the CDN. A second upload sends latitude, longitude, altitude, heading, speed,
accuracy, EXIF date/orientation, camera make/model, dimensions, focal length,
gyroscope, accelerometer, derived pitch/roll/yaw, sequence/group identifiers,
filename, hash and capture address to the Mapilio API. These are code-observed
fields, not a claim about every server-side field or public display. Evidence:
`helper/upload.js:42-70` and `helper/upload.js:120-230`.

**Account/profile and token persistence:** Redux Persist uses AsyncStorage for
the root state and excludes camera, image and marketplace reducers; the code
therefore can persist auth, profile and credential state unless a reducer is
otherwise excluded. The account-delete UI calls the Mapilio account endpoint,
clears Redux auth state and removes the OneSignal email. Apple has a separate
authorization-code path; the source explicitly says Google and Facebook
delete-account logic is TODO. Evidence: `store/store.js:14-25`,
`util/helpers/api/MobileAccountApi.js:1-17`,
`screens/Profile/DeleteAccount.js:22-74`.

## Google Play Data safety correction

**Checked 2026-09-23:** the Data safety and Health apps submission attempt
failed Google's quick checks: Device or other IDs remain undeclared for
published Android `1.0.58 (69)`. Both changes returned to "not yet submitted"
and the submit button is disabled. The "Proceed anyway" override was not used.
The repository candidate `1.2.1 (70)` has not replaced that binary. The separate
developer-account policy page now reports no issues after organization
verification. Neither task reopens the completed public-source release.

The table below maps source evidence at `0ab665e` to fields that need checking.
It is not a completed form or evidence of the exact behavior of version 69.
Use the shipped artifact and effective provider configuration to reconcile it
before submitting. Do not assume the reported identifier comes from one SDK
without checking the released build.

| Play data type                                      | Evidence in this repository                                                                                                                                                       | What still needs verification                                                                                                                                                                 |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name, Email address, User IDs                       | Profile data includes `display_name`, `username`, `email`, and `id`. `getUserInformation` associates email/id with Sentry and sends email to the identity endpoint and OneSignal. | Shipped account/profile flows, associated purposes, provider retention and deletion. A profile read alone does not prove a fresh upload of every field.                                       |
| Photos; Precise location                            | `getHash` uploads a JPEG and account email; `imageryUpload` sends latitude/longitude, route and capture metadata.                                                                 | Version 69 upload payloads, publication behavior, user controls and retention, including the image server.                                                                                    |
| Crash logs, Diagnostics, Other app performance data | Non-development `Sentry.init` enables tracing at `1.0`; upload failures call `captureException`.                                                                                  | Actual release events, integrations, sampling and scrubbing, including request/error context.                                                                                                 |
| App interactions                                    | OneSignal initializes at startup when configured. Its documented collection includes sessions and notification interactions.                                                      | Effective shipped SDK configuration and purposes; notification permission is not evidence that all SDK collection has stopped.                                                                |
| Device or other IDs                                 | Google has already reported off-device transmission in version 69. OneSignal documents push-token processing.                                                                     | Identify the actual fields and destinations in the shipped build and declare the applicable uses. Not collecting an advertising ID does not prove that no other identifiers leave the device. |
| In-app search history; Other user-generated content | Search/reverse-geocoding and profile/contribution flows are present.                                                                                                              | Which query/content fields leave the device, actual recipients, persistence and corresponding categories. Local Redux history alone is not evidence of off-device collection.                 |

Source anchors: [`App.js`](../../App.js),
[`getUserInformation`](../../store/reducers/loginReducer/getUserInformation.js),
[`upload helpers`](../../helper/upload.js), and
[`search client`](../../util/helpers/api/Search.js).
OneSignal's [Data safety guidance](https://documentation.onesignal.com/docs/en/google-play-data-safety-requirements)
and [collected-data inventory](https://documentation.onesignal.com/docs/en/data-collected-by-the-onesignal-sdk)
were checked on the same date. They describe SDK behavior, not proof of our
released configuration. A free app is not automatically exempt from disclosures;
equally, do not claim purchase-history collection just because an SDK supports it.

Following [Google's definitions](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en),
include off-device SDK processing and all currently distributed versions.
Decide collection and sharing separately: a service-provider or user-initiated
transfer exception needs facts supporting it. Do not mark data optional merely
because an OS permission exists, or infer encryption, deletion, or retention
from a local test.

Remaining verification (historical [#4](https://github.com/mapilio/mobile-apps/issues/4)
is closed; release evidence is tracked in [#74](https://github.com/mapilio/mobile-apps/issues/74)):

- [ ] Compare the shipped version 69 SDKs/network behavior and active release
      tracks with the categories above, then correct the form, including the
      identifier finding, Name and User IDs.
- [ ] Resolve collection purposes, optional/required collection, sharing,
      encryption and deletion answers from actual behavior and provider terms.
- [ ] Verify the public deletion-request URL, privacy policy and age/Families
      answers against the app and existing published policies.
- [ ] Correct the identifier declaration and resubmit Data safety and Health
      apps. The 2026-09-23 attempt did not pass quick checks or enter review.
- [ ] Confirm Google's review result and publication. Submission or passing
      local tests does not complete this step.

## Deletion and retention observations

- Local capture deletion removes the image file when present and then its
  SQLite row; upload cancellation and local deletion do not establish deletion
  of an already uploaded contribution. Evidence: `db.js:214-235`,
  `helper/upload.js:248-265`, and `screens/UserSequence.js:157-166`.
- The Terms page says user content may remain subject to its license and the
  Privacy page has a retention section, but this source review does not infer
  a retention period. Confirm server records, CDN objects, backups, logs,
  derived/public imagery, moderation records, and deletion SLAs with owners.
- Contributions may remain publicly available after account deletion or
  contribution deletion depending on backend policy and license. Confirm the
  rule, user-facing notice, and a tested takedown path.
- Google/Facebook account deletion is an explicit source TODO. Do not describe
  provider deletion as complete until implemented or an approved backend
  process is documented and verified. Tracked in
  [#164](https://github.com/mapilio/mobile-apps/issues/164).

## Terms decision checklist

- [ ] Legal owner confirms the company legal name, registered/contact address,
      jurisdiction, governing law, dispute process, and privacy contact.
- [ ] Legal owner decides the age threshold, consent/parental wording, and
      whether the 18+ statement matches product, stores, and target markets.
- [ ] Legal owner decides whether the contribution/upload license is required,
      its duration and scope, sublicensing/derivative/publication rights, and the
      exact CC BY-SA wording and attribution path for Mapilio imagery and OSM
      derivatives.
- [ ] Maintainer and legal owner confirm prohibited capture rules cover people,
      license plates, private property, sensitive locations, children, and
      privacy-invasive capture, with a reporting/takedown route.
- [ ] Maintainer confirms repository, App Store, Google Play, privacy, terms,
      support, and deletion links are current and mutually consistent.
- [ ] Asset owner confirms every bundled image, font, icon, map asset and SDK
      notice has redistribution rights; see `asset-rights-manifest.json` and
      `THIRD_PARTY_NOTICES.md`. The Apache-2.0 repository license does not by
      itself resolve third-party asset rights.

## Maintainer facts checklist

- [ ] Record exact production API, CDN, search, tile, OneSignal and Expo
      Updates / EAS hosts, owners, subprocessors, regions, request fields, logs
      and retention periods.
- [ ] Confirm Sentry transaction fields, network instrumentation, effective
      production sampling, retention, region and user association, including
      the configured `tracesSampleRate: 1.0`.
- [ ] Confirm Expo Updates / EAS request fields, device identifiers, production
      project, region, logs and retention for the configured `u.expo.dev`
      destination.
- [ ] Confirm all collected fields, permission prompts, background behavior,
      EXIF/motion handling, publication fields, and whether raw images are retained.
- [ ] Confirm account deletion, contribution deletion/takedown, backup expiry,
      token revocation, and Google/Facebook handling end to end.
- [ ] Confirm the policy URLs rendered in registration and profile settings are
      identical in content and reachable without an account.

## Legal decisions checklist

- [ ] Approve or revise Privacy scope, notices, rights, transfers,
      processors, retention, deletion, and contact details for the actual build.
- [ ] Approve or revise Terms identity, age/consent, user-content license,
      CC BY-SA/OSM interaction, prohibited capture rules, jurisdiction and
      remedies.
- [ ] Decide whether any release claim needs a limitation, disclosure,
      regional version, or additional consent before publication.

## Production verification checklist

- [ ] From a clean iOS and Android release build, open every privacy, terms,
      support and deletion link and capture HTTP/status evidence without personal
      test data.
- [ ] Exercise permission allow/deny paths for camera, photos, location,
      notifications, microphone and motion; record actual collection behavior.
- [ ] Use synthetic imagery only to verify local deletion, upload destinations,
      public fields, account deletion, provider sign-in deletion, and takedown.
- [ ] Verify network requests against the owner-approved host inventory and
      confirm no secrets or personal test-account data enter this packet.
- [ ] Store restricted evidence for legal-owner decisions and production
      results in the approved private release record; keep this public packet
      factual.

## Acceptance evidence

Closing evidence should include: (1) maintainer fact checklist completed with
an owner and date; (2) legal decision checklist explicitly marked approved,
revised, or still open by the legal owner; (3) production verification results
for both platforms and the approved host/policy/link inventory; (4) evidence
that Google/Facebook deletion, contribution retention/takedown, and asset
rights are either verified or explicitly dispositioned; and (5) links to the
final policy versions and approval record. Until all required evidence is
attached and the responsible owners record their decisions, legal review
remains pending. This packet itself is preparation only.
