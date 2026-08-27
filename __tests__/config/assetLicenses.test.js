const crypto = require('crypto');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const manifest = require('../../asset-rights-manifest.json');
const ownerConfirmationUrl =
  'https://github.com/mapilio/mobile-apps/issues/99#issuecomment-5425094489';
const {
  buildInventory,
  classifyAsset,
  checkInventory,
  parseGitIndexEntries,
  trackedAssetPaths,
  trackedRepositoryPaths,
  validateManifest,
  validateTrackedEntries,
} = require('../../scripts/assets/asset-inventory');

const projectFile = (...parts) => path.join(__dirname, '..', '..', ...parts);

const poppinsFiles = {
  'Poppins-Light.ttf': '647f014d36822ef7e0413ffbb65598ae0cb57fb798e635c63912c93d94eb356a',
  'Poppins-Medium.ttf': 'e554db189b5d944ef0e6f98ee0e4e8c75f69e95315dc9f4ae0c616a8756a2ba4',
  'Poppins-Regular.ttf': '78f127277756ae464f4eb665ce214cb6315746f6f4193e95b31f18f4b3e97527',
  'Poppins-SemiBold.ttf': 'bf9c1ff640acc8bb5441a9b564360943f9db90969742aa33a36329b2828d2759',
};

describe('bundled asset licensing', () => {
  it('includes the complete Poppins OFL notice', () => {
    const license = fs.readFileSync(projectFile('assets', 'fonts', 'OFL.txt'), 'utf8');

    expect(license).toContain('Copyright 2020 The Poppins Project Authors');
    expect(license).toContain('SIL OPEN FONT LICENSE Version 1.1');
    expect(license).toContain('PERMISSION & CONDITIONS');
    expect(license).toContain('DISCLAIMER');
  });

  it.each(Object.entries(poppinsFiles))('tracks the licensed bytes for %s', (file, digest) => {
    const contents = fs.readFileSync(projectFile('assets', 'fonts', file));
    const actual = crypto.createHash('sha256').update(contents).digest('hex');

    expect(actual).toBe(digest);
  });

  it('has one deterministic record for every tracked asset', () => {
    const inventory = buildInventory(projectFile());
    const paths = inventory.assets.map((record) => record.path);

    expect(paths).toHaveLength(trackedAssetPaths(projectFile()).length);
    expect(new Set(paths).size).toBe(paths.length);
    expect(
      inventory.assets.every(
        (record) =>
          record.path.startsWith('assets/') &&
          Number.isInteger(record.bytes) &&
          /^[a-f0-9]{64}$/.test(record.sha256)
      )
    ).toBe(true);
    expect(paths).toEqual([...paths].sort());
    expect(() => checkInventory(projectFile())).not.toThrow();
  });

  it('asserts the exact verified family split and removed families', () => {
    const customFamilies = manifest.families.filter(
      (family) => family.license === 'Mapilio proprietary'
    );
    const verifiedIds = [
      'brand-root-images',
      'walkthrough-mapilio',
      'marketplace',
      'tooltip',
      'general-raster-mapilio',
      'illustration-modules',
      'marketplace-illustration-modules',
      'user-feed-illustration-modules',
      'mapilio-logos',
    ];

    expect(customFamilies.length).toBeGreaterThan(0);
    expect(
      customFamilies.every(
        (family) =>
          family.rightsStatus === 'verified' &&
          family.rightsOwnerConfirmation === 'confirmed' &&
          family.owner === 'Mapilio' &&
          family.source === ownerConfirmationUrl
      )
    ).toBe(true);
    expect(
      manifest.families
        .filter((family) => family.rightsStatus === 'verified')
        .map((family) => family.id)
    ).toEqual([...verifiedIds, 'fonts']);
    expect(manifest.families.filter((family) => family.rightsStatus === 'review-required')).toEqual(
      []
    );
    expect(classifyAsset('assets/favicon.png', manifest).id).toBe('brand-root-images');
    expect(classifyAsset('assets/appstore.png', manifest).id).toBe('brand-root-images');
    expect(classifyAsset('assets/playstore.png', manifest).id).toBe('brand-root-images');
    expect(() => classifyAsset('assets/images/osm.png', manifest)).toThrow(/exactly one family/);
    expect(() => classifyAsset('assets/images/gopro.png', manifest)).toThrow(/exactly one family/);
    expect(classifyAsset('assets/svg/logos/MapilioLogoBeta.js', manifest).id).toBe('mapilio-logos');
    expect(classifyAsset('assets/svg/logos/index.js', manifest).id).toBe('mapilio-logos');
    expect(() => classifyAsset('assets/svg/logos/GoogleLogo.js', manifest)).toThrow(
      /exactly one family/
    );
    expect(manifest.families.find((family) => family.id === 'fonts')).toMatchObject({
      rightsStatus: 'verified',
      license: 'OFL-1.1',
      notice: 'assets/fonts/OFL.txt',
    });
  });

  it('keeps package metadata and LICENSE scope aligned', () => {
    const packageMetadata = require('../../package.json');
    const lockfileRoot = require('../../package-lock.json').packages[''];
    const licenseText = fs.readFileSync(projectFile('LICENSE'), 'utf8');

    expect(packageMetadata.license).toBe('SEE LICENSE IN LICENSE');
    expect(lockfileRoot.license).toBe('SEE LICENSE IN LICENSE');
    expect(licenseText).toContain('source code in this repository is licensed under the Apache');
    expect(licenseText).toContain('Mapilio-proprietary visual families listed in');
    expect(licenseText).toContain('asset-rights-manifest.json are excluded');
    expect(licenseText).toContain('Poppins and other third-party assets follow the notices');
  });

  it('rejects unclassified and multiply classified assets', () => {
    expect(() => classifyAsset('assets/new-area/image.png', manifest)).toThrow(
      /exactly one family/
    );
    expect(() => classifyAsset('assets/.DS_Store', manifest)).toThrow(/exactly one family/);

    const overlappingManifest = {
      ...manifest,
      families: [
        ...manifest.families,
        {
          ...manifest.families.find((family) => family.id === 'walkthrough-mapilio'),
          id: 'overlapping-walkthrough-family',
        },
      ],
    };
    const currentAssetPaths = trackedAssetPaths(projectFile());
    expect(() =>
      validateManifest(
        overlappingManifest,
        currentAssetPaths,
        trackedRepositoryPaths(projectFile())
      )
    ).toThrow(/Duplicate asset selector/);
    expect(() => classifyAsset('assets/svg/illustrations/NewDirectory/icon.js', manifest)).toThrow(
      /exactly one family/
    );
  });

  it('rejects duplicate family identifiers and invalid verified status', () => {
    const duplicateManifest = {
      ...manifest,
      families: [manifest.families[0], { ...manifest.families[1], id: manifest.families[0].id }],
    };
    expect(() => validateManifest(duplicateManifest)).toThrow(/family ids must be unique/);

    const invalidManifest = {
      ...manifest,
      families: manifest.families.map((family) =>
        family.id === 'walkthrough-mapilio'
          ? { ...family, rightsOwnerConfirmation: 'pending' }
          : family
      ),
    };
    expect(() => validateManifest(invalidManifest)).toThrow(/Verified asset family/);
  });

  it('rejects malformed schema, selectors, and field types', () => {
    const cases = [
      { ...manifest, schemaVersion: 2 },
      { ...manifest, assetRoot: 'assets/' },
      { ...manifest, reviewNote: '' },
      {
        ...manifest,
        families: manifest.families.map((family) =>
          family.id === 'illustration-modules'
            ? { ...family, prefix: 'assets/svg/illustrations' }
            : family
        ),
      },
      {
        ...manifest,
        families: manifest.families.map((family) =>
          family.id === 'illustration-modules'
            ? { ...family, prefix: 'assets/does-not-exist/' }
            : family
        ),
      },
      {
        ...manifest,
        families: manifest.families.map((family) =>
          family.id === 'illustration-modules' ? { ...family, directChildrenOnly: 'true' } : family
        ),
      },
      {
        ...manifest,
        families: manifest.families.map((family) =>
          family.id === 'illustration-modules' ? { ...family, unexpected: true } : family
        ),
      },
      {
        ...manifest,
        families: manifest.families.map((family) =>
          family.id === 'illustration-modules'
            ? {
                ...family,
                rightsStatus: 'review-required',
                rightsOwnerConfirmation: 'pending',
                license: 'MIT',
              }
            : family
        ),
      },
      {
        ...manifest,
        families: manifest.families.map((family) =>
          family.id === 'illustration-modules' ? { ...family, source: 42 } : family
        ),
      },
      {
        ...manifest,
        families: manifest.families.map((family) =>
          family.id === 'fonts' ? { ...family, notice: 'missing-notice.md' } : family
        ),
      },
    ];

    for (const invalidManifest of cases) {
      expect(() => validateManifest(invalidManifest)).toThrow();
    }
  });

  it('rejects stale explicit selectors and non-regular Git index entries', () => {
    const staleManifest = {
      ...manifest,
      families: manifest.families.map((family) =>
        family.id === 'brand-root-images'
          ? { ...family, paths: [...family.paths, 'assets/removed.png'] }
          : family
      ),
    };
    expect(() => validateManifest(staleManifest, ['assets/appstore.png'])).toThrow(
      /stale path selector/
    );

    const hash = 'a'.repeat(40);
    const entries = parseGitIndexEntries(
      `120000 ${hash} 0\tassets/link.png\0` + `160000 ${hash} 0\tassets/submodule\0`
    );
    expect(() => validateTrackedEntries(entries)).toThrow(/non-regular Git mode/);
    expect(entries).toEqual([
      { mode: '120000', path: 'assets/link.png' },
      { mode: '160000', path: 'assets/submodule' },
    ]);
  });

  it('preserves parser paths and rejects nonportable tracked paths', () => {
    const hash = 'b'.repeat(40);
    const parsed = parseGitIndexEntries(
      `100644 ${hash} 0\tassets/line\nname.png\0` + `100644 ${hash} 0\tassets\\literal.png\0`
    );
    expect(parsed).toEqual([
      { mode: '100644', path: 'assets/line\nname.png' },
      { mode: '100644', path: 'assets\\literal.png' },
    ]);
    for (const invalidPath of [
      'assets/line\nname.png',
      'assets\\literal.png',
      '../assets/file.png',
      '/assets/file.png',
      'assets/dir/../file.png',
    ]) {
      expect(() => validateTrackedEntries([{ mode: '100644', path: invalidPath }])).toThrow(
        /portable normalized repository path/
      );
    }
  });

  it('rejects asset symlinks without rejecting unrelated repository symlinks', () => {
    const temporaryRepository = fs.mkdtempSync(path.join(os.tmpdir(), 'asset-inventory-'));

    try {
      execFileSync('git', ['init', '--quiet'], { cwd: temporaryRepository });
      fs.mkdirSync(path.join(temporaryRepository, 'assets'));
      fs.writeFileSync(path.join(temporaryRepository, 'LICENSE'), 'notice\n');
      fs.writeFileSync(path.join(temporaryRepository, 'assets', 'icon.png'), 'image\n');
      fs.symlinkSync('LICENSE', path.join(temporaryRepository, 'notice-link'));
      execFileSync('git', ['add', 'LICENSE', 'notice-link', 'assets/icon.png'], {
        cwd: temporaryRepository,
      });

      expect(trackedRepositoryPaths(temporaryRepository)).toContain('notice-link');
      expect(trackedAssetPaths(temporaryRepository)).toEqual(['assets/icon.png']);

      fs.symlinkSync('../LICENSE', path.join(temporaryRepository, 'assets', 'license-link'));
      execFileSync('git', ['add', 'assets/license-link'], { cwd: temporaryRepository });

      expect(() => trackedAssetPaths(temporaryRepository)).toThrow(/non-regular Git mode/);
    } finally {
      fs.rmSync(temporaryRepository, { recursive: true, force: true });
    }
  });

  it('accepts a repository-level verified notice', () => {
    const currentAssetPaths = trackedAssetPaths(projectFile());
    const currentRepositoryPaths = trackedRepositoryPaths(projectFile());
    const evidenceManifest = {
      ...manifest,
      families: manifest.families.map((family) => {
        if (family.id === 'fonts') {
          return { ...family, notice: 'THIRD_PARTY_NOTICES.md' };
        }
        return family;
      }),
    };
    expect(() =>
      validateManifest(evidenceManifest, currentAssetPaths, currentRepositoryPaths)
    ).not.toThrow();
  });
});
