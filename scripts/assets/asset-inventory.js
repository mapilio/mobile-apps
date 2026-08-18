'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..', '..');
const manifestPath = path.join(repoRoot, 'asset-rights-manifest.json');
const inventoryPath = path.join(repoRoot, 'asset-inventory.json');
const manifestKeys = new Set(['schemaVersion', 'assetRoot', 'reviewNote', 'families']);
const familyKeys = new Set([
  'id',
  'paths',
  'prefix',
  'directChildrenOnly',
  'rightsStatus',
  'rightsOwnerConfirmation',
  'license',
  'source',
  'notice',
  'owner',
]);
const licensePattern = /^(?=.*[A-Za-z0-9])[A-Za-z0-9.+:()\-\s]+$/;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function parseGitIndexEntries(output) {
  return output
    .split('\0')
    .filter(Boolean)
    .map((entry) => {
      const separator = entry.indexOf('\t');
      const header = separator === -1 ? '' : entry.slice(0, separator);
      const match = /^(\d{6}) [0-9a-f]+ \d$/.exec(header);
      if (!match) {
        throw new Error(`Unable to parse Git index entry: ${entry}`);
      }
      const entryPath = entry.slice(separator + 1);
      if (separator === -1 || entryPath === '') {
        throw new Error(`Unable to parse Git index entry path: ${entry}`);
      }
      return { mode: match[1], path: entryPath };
    });
}

function validateTrackedPath(entryPath) {
  if (
    typeof entryPath !== 'string' ||
    entryPath === '' ||
    entryPath.includes('\\') ||
    /[\u0000-\u001f\u007f]/.test(entryPath) ||
    entryPath.startsWith('/') ||
    /^[A-Za-z]:[\\/]/.test(entryPath) ||
    entryPath.split('/').includes('..') ||
    entryPath.endsWith('/') ||
    entryPath !== path.posix.normalize(entryPath)
  ) {
    throw new Error(`Tracked path is not a portable normalized repository path: ${entryPath}`);
  }
}

function validateTrackedPaths(entries) {
  const paths = new Set();
  for (const entry of entries) {
    validateTrackedPath(entry.path);
    if (paths.has(entry.path)) {
      throw new Error(`Duplicate tracked path: ${entry.path}`);
    }
    paths.add(entry.path);
  }
}

function validateTrackedEntries(entries) {
  validateTrackedPaths(entries);
  for (const entry of entries) {
    if (entry.mode !== '100644' && entry.mode !== '100755') {
      throw new Error(
        `Tracked asset ${entry.path} has non-regular Git mode ${entry.mode}; symlinks and gitlinks are not allowed.`
      );
    }
  }
}

function trackedAssetEntries(root = repoRoot) {
  const output = execFileSync('git', ['ls-files', '--stage', '-z', '--', 'assets'], {
    cwd: root,
    encoding: 'utf8',
  });
  const entries = parseGitIndexEntries(output);
  validateTrackedEntries(entries);
  return entries;
}

function trackedRepositoryEntries(root = repoRoot) {
  const output = execFileSync('git', ['ls-files', '--stage', '-z'], {
    cwd: root,
    encoding: 'utf8',
  });
  const entries = parseGitIndexEntries(output);
  validateTrackedPaths(entries);
  return entries;
}

function trackedAssetPaths(root = repoRoot) {
  return trackedAssetEntries(root).map((entry) => entry.path);
}

function trackedRepositoryPaths(root = repoRoot) {
  return trackedRepositoryEntries(root).map((entry) => entry.path);
}

function matchesFamily(assetPath, family) {
  if (family.paths && family.paths.includes(assetPath)) {
    return true;
  }
  if (!family.prefix || !assetPath.startsWith(family.prefix)) {
    return false;
  }
  if (family.directChildrenOnly) {
    return !assetPath.slice(family.prefix.length).includes('/');
  }
  return true;
}

function classifyAsset(assetPath, manifest) {
  const matches = manifest.families.filter((family) => matchesFamily(assetPath, family));
  if (matches.length !== 1) {
    const familyIds = matches.map((family) => family.id).join(', ') || 'none';
    throw new Error(`Asset ${assetPath} must match exactly one family; matched: ${familyIds}`);
  }
  return matches[0];
}

function isNormalizedAssetPath(assetPath) {
  return assetPath.startsWith('assets/') && isNormalizedRepositoryPath(assetPath);
}

function isNormalizedRepositoryPath(repositoryPath) {
  return (
    typeof repositoryPath === 'string' &&
    repositoryPath !== '' &&
    !repositoryPath.includes('\\') &&
    !/[\u0000-\u001f\u007f]/.test(repositoryPath) &&
    !repositoryPath.startsWith('/') &&
    !/^[A-Za-z]:[\\/]/.test(repositoryPath) &&
    !repositoryPath.split('/').includes('..') &&
    repositoryPath === path.posix.normalize(repositoryPath) &&
    !repositoryPath.endsWith('/')
  );
}

function validateManifest(manifest, assetPaths, repositoryPaths) {
  const currentAssetPaths = assetPaths === undefined ? trackedAssetPaths() : assetPaths;
  const currentRepositoryPaths =
    repositoryPaths === undefined ? trackedRepositoryPaths() : repositoryPaths;
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    throw new Error('Asset rights manifest must be an object.');
  }
  if (
    Object.keys(manifest).some((key) => !manifestKeys.has(key)) ||
    manifest.schemaVersion !== 1 ||
    manifest.assetRoot !== 'assets' ||
    typeof manifest.reviewNote !== 'string' ||
    manifest.reviewNote.trim() === '' ||
    !Array.isArray(manifest.families) ||
    manifest.families.length === 0
  ) {
    throw new Error('Asset rights manifest has an invalid schema.');
  }

  const ids = new Set();
  const selectors = new Set();
  const explicitPaths = new Set();
  for (const family of manifest.families) {
    if (!family || typeof family !== 'object' || Array.isArray(family)) {
      throw new Error('Asset families must be objects.');
    }
    if (Object.keys(family).some((key) => !familyKeys.has(key))) {
      throw new Error(`Asset family ${family.id || '<missing>'} has an unknown field.`);
    }
    if (!/^[a-z][a-z0-9-]*$/.test(family.id) || ids.has(family.id)) {
      throw new Error(`Asset family ids must be unique: ${family.id || '<missing>'}`);
    }
    ids.add(family.id);

    const hasPaths = Object.prototype.hasOwnProperty.call(family, 'paths');
    const hasPrefix = Object.prototype.hasOwnProperty.call(family, 'prefix');
    if ((hasPaths ? 1 : 0) + (hasPrefix ? 1 : 0) !== 1) {
      throw new Error(`Asset family ${family.id} needs exactly one selector.`);
    }
    if (hasPaths) {
      if (
        !Array.isArray(family.paths) ||
        family.paths.length === 0 ||
        family.paths.some(
          (assetPath) => typeof assetPath !== 'string' || !isNormalizedAssetPath(assetPath)
        )
      ) {
        throw new Error(`Asset family ${family.id} has invalid paths.`);
      }
      for (const assetPath of family.paths) {
        if (explicitPaths.has(assetPath) || selectors.has(`path:${assetPath}`)) {
          throw new Error(`Duplicate asset selector: ${assetPath}`);
        }
        explicitPaths.add(assetPath);
        selectors.add(`path:${assetPath}`);
        if (!currentAssetPaths.includes(assetPath)) {
          throw new Error(`Asset family ${family.id} has stale path selector: ${assetPath}`);
        }
      }
    } else if (
      typeof family.prefix !== 'string' ||
      !family.prefix.startsWith('assets/') ||
      family.prefix.includes('\\') ||
      family.prefix !== path.posix.normalize(family.prefix) ||
      !family.prefix.endsWith('/')
    ) {
      throw new Error(`Asset family ${family.id} has an invalid prefix.`);
    } else {
      const selector = `prefix:${family.prefix}`;
      if (selectors.has(selector)) {
        throw new Error(`Duplicate asset selector: ${family.prefix}`);
      }
      selectors.add(selector);
      if (!currentAssetPaths.some((assetPath) => matchesFamily(assetPath, family))) {
        throw new Error(`Asset family ${family.id} has an empty prefix selector.`);
      }
    }

    if (
      Object.prototype.hasOwnProperty.call(family, 'directChildrenOnly') &&
      (typeof family.directChildrenOnly !== 'boolean' || !hasPrefix)
    ) {
      throw new Error(`Asset family ${family.id} has invalid directChildrenOnly.`);
    }
    if (
      typeof family.rightsStatus !== 'string' ||
      !['verified', 'review-required'].includes(family.rightsStatus) ||
      typeof family.rightsOwnerConfirmation !== 'string'
    ) {
      throw new Error(`Asset family ${family.id} has invalid rights status fields.`);
    }
    if (
      family.rightsStatus === 'review-required' &&
      (family.rightsOwnerConfirmation !== 'pending' || family.license !== null)
    ) {
      throw new Error(`Asset family ${family.id} must remain pending rights-owner confirmation.`);
    }
    for (const evidenceField of ['owner', 'source', 'notice']) {
      if (
        Object.prototype.hasOwnProperty.call(family, evidenceField) &&
        (typeof family[evidenceField] !== 'string' || family[evidenceField].trim() === '')
      ) {
        throw new Error(`Asset family ${family.id} has invalid ${evidenceField} evidence.`);
      }
    }
    if (family.notice && !currentRepositoryPaths.includes(family.notice)) {
      throw new Error(`Asset family ${family.id} has stale notice path: ${family.notice}`);
    }
    if (family.notice && !isNormalizedRepositoryPath(family.notice)) {
      throw new Error(`Asset family ${family.id} has an invalid notice path.`);
    }
    if (
      family.rightsStatus === 'verified' &&
      (family.rightsOwnerConfirmation !== 'confirmed' ||
        typeof family.license !== 'string' ||
        !licensePattern.test(family.license.trim()) ||
        family.license.trim() === '' ||
        typeof family.owner !== 'string' ||
        family.owner.trim() === '' ||
        (!family.source && !family.notice))
    ) {
      throw new Error(`Verified asset family ${family.id} needs valid license evidence.`);
    }
  }

  for (const assetPath of currentAssetPaths) {
    classifyAsset(assetPath, manifest);
  }
}

function buildInventory(root = repoRoot, manifest = readJson(manifestPath)) {
  const assetPaths = trackedAssetPaths(root);
  const repositoryPaths = trackedRepositoryPaths(root);
  validateManifest(manifest, assetPaths, repositoryPaths);

  const records = assetPaths.sort().map((assetPath) => {
    const contents = fs.readFileSync(path.join(root, assetPath));
    return {
      path: assetPath,
      family: classifyAsset(assetPath, manifest).id,
      bytes: contents.length,
      sha256: crypto.createHash('sha256').update(contents).digest('hex'),
    };
  });

  const paths = new Set();
  for (const record of records) {
    if (paths.has(record.path)) {
      throw new Error(`Duplicate asset record: ${record.path}`);
    }
    paths.add(record.path);
  }

  return {
    schemaVersion: 1,
    generatedBy: 'scripts/assets/asset-inventory.js',
    assets: records,
  };
}

function checkInventory(root = repoRoot) {
  const manifest = readJson(path.join(root, 'asset-rights-manifest.json'));
  const inventoryFile = path.join(root, 'asset-inventory.json');
  if (!fs.existsSync(inventoryFile)) {
    throw new Error('asset-inventory.json is missing; run npm run assets:update.');
  }

  const expected = buildInventory(root, manifest);
  const actual = readJson(inventoryFile);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      'Asset inventory is stale or differs from tracked asset bytes; run npm run assets:update and review the result.'
    );
  }
  return expected;
}

function main(command) {
  if (command === 'update') {
    const inventory = buildInventory();
    fs.writeFileSync(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`);
    process.stdout.write(
      `Wrote ${inventory.assets.length} asset records to asset-inventory.json\n`
    );
    return;
  }
  if (command === 'check') {
    const inventory = checkInventory();
    process.stdout.write(`Asset inventory is current (${inventory.assets.length} records).\n`);
    return;
  }
  throw new Error('Usage: node scripts/assets/asset-inventory.js <update|check>');
}

if (require.main === module) {
  try {
    main(process.argv[2]);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = {
  buildInventory,
  checkInventory,
  classifyAsset,
  matchesFamily,
  parseGitIndexEntries,
  trackedRepositoryPaths,
  trackedAssetPaths,
  validateManifest,
  validateTrackedEntries,
};
