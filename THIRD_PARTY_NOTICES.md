# Third-Party Notices

This file records third-party material distributed directly with Mapilio Mobile.
Package-manager dependencies retain their own license metadata and notices.

## Poppins

The following bundled font files belong to the Poppins family:

- `assets/fonts/Poppins-Light.ttf`
- `assets/fonts/Poppins-Medium.ttf`
- `assets/fonts/Poppins-Regular.ttf`
- `assets/fonts/Poppins-SemiBold.ttf`

Copyright 2020 The Poppins Project Authors
(<https://github.com/itfoundry/Poppins>).

Poppins is distributed under the SIL Open Font License, Version 1.1. The
complete license text is included at [`assets/fonts/OFL.txt`](assets/fonts/OFL.txt).
The canonical Google Fonts distribution is available from
[`google/fonts/ofl/poppins`](https://github.com/google/fonts/tree/main/ofl/poppins).

The files currently bundled by this repository have these SHA-256 digests:

```text
647f014d36822ef7e0413ffbb65598ae0cb57fb798e635c63912c93d94eb356a  Poppins-Light.ttf
e554db189b5d944ef0e6f98ee0e4e8c75f69e95315dc9f4ae0c616a8756a2ba4  Poppins-Medium.ttf
78f127277756ae464f4eb665ce214cb6315746f6f4193e95b31f18f4b3e97527  Poppins-Regular.ttf
bf9c1ff640acc8bb5441a9b564360943f9db90969742aa33a36329b2828d2759  Poppins-SemiBold.ttf
```

## Removed third-party and unclear-provenance assets

The release bundle intentionally does not retain the previously bundled
Lottie exports, language-flag PNGs, OpenStreetMap-branded walkthrough and login
images, GoPro-branded image, or Google/Facebook logo modules. Their removal is
recorded in the asset inventory diff; the application uses text or verified
Mapilio visuals in those presentations.

## Asset inventory and review status

`asset-rights-manifest.json` defines the non-overlapping asset families and
records the verified rights evidence for each retained family. The generated
`asset-inventory.json` records every tracked asset path, family,
byte size, and SHA-256 digest. Run `npm run assets:check` to detect additions, removals,
renames, byte changes, duplicate records, stale records, and unclassified
assets. Run `npm run assets:update` only after reviewing an intentional change.

The inventory check is a repository consistency control, not legal advice or
confirmation of ownership or redistribution rights. Mapilio-owned custom
families are recorded as verified only where the manifest includes owner,
license, and source evidence.
