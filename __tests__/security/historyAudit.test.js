const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '../..');
const summarizer = path.join(root, 'scripts/security/summarize-gitleaks-report.js');
const audit = path.join(root, 'scripts/security/audit-all-history.sh');

function summarize(report) {
  return spawnSync(process.execPath, [summarizer], {
    cwd: root,
    input: JSON.stringify(report),
    encoding: 'utf8',
  });
}

function makeReleaseFixture({ report = '[]\n', scannerExit = 0, scannerStderr = '' } = {}) {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'history-audit-'));
  const source = path.join(temporaryRoot, 'source');
  const mirror = path.join(temporaryRoot, 'mirror.git');
  const fakeBin = path.join(temporaryRoot, 'bin');
  const fakeGitleaks = path.join(fakeBin, 'gitleaks');
  const fakeGit = path.join(fakeBin, 'git');
  const liveRefs = path.join(temporaryRoot, 'live-refs');
  const liveCalls = path.join(temporaryRoot, 'live-calls');
  const realGit = spawnSync('sh', ['-c', 'command -v git'], { encoding: 'utf8' }).stdout.trim();

  fs.mkdirSync(fakeBin);
  fs.writeFileSync(
    fakeGitleaks,
    `#!/bin/sh
if [ "$1" = version ]; then printf "8.30.1\\n"; exit 0; fi
${scannerStderr ? `printf '%s\\n' '${scannerStderr}' >&2` : ''}
printf '%s' '${report.replaceAll("'", "'\\''")}'
[ -n "$LIVE_CHANGE_FILE" ] && cp "$LIVE_CHANGE_FILE" "$LIVE_REFS"
[ -n "$LOCAL_CHANGE_REPOSITORY" ] && "$REAL_GIT" -C "$LOCAL_CHANGE_REPOSITORY" update-ref refs/tags/local-drift "$LOCAL_CHANGE_OID"
exit ${scannerExit}
`,
    { mode: 0o755 }
  );
  fs.writeFileSync(
    fakeGit,
    `#!/bin/sh
if [ "$1" = ls-remote ]; then
  calls=0
  [ -f "$LIVE_CALLS" ] && calls=$(cat "$LIVE_CALLS")
  calls=$((calls + 1))
  printf '%s' "$calls" > "$LIVE_CALLS"
  cat "$LIVE_REFS"
  exit 0
fi
exec "$REAL_GIT" "$@"
`,
    { mode: 0o755 }
  );
  fs.mkdirSync(source);
  const git = (args) => spawnSync('git', args, { cwd: source, encoding: 'utf8' });
  expect(git(['init', '-q']).status).toBe(0);
  expect(git(['branch', '-M', 'main']).status).toBe(0);
  expect(
    git([
      '-c',
      'user.name=Test',
      '-c',
      'user.email=test@example.invalid',
      'commit',
      '--allow-empty',
      '-qm',
      'fixture',
    ]).status
  ).toBe(0);
  expect(spawnSync('git', ['clone', '--mirror', source, mirror], { encoding: 'utf8' }).status).toBe(
    0
  );
  const mainRevision = spawnSync('git', ['-C', mirror, 'rev-parse', 'refs/heads/main'], {
    encoding: 'utf8',
  }).stdout.trim();
  expect(
    spawnSync('git', ['-C', mirror, 'update-ref', 'refs/pull/1/head', mainRevision]).status
  ).toBe(0);
  expect(
    spawnSync('git', [
      '-C',
      mirror,
      'remote',
      'set-url',
      'origin',
      'git@github.com:mapilio/mobile-apps.git',
    ]).status
  ).toBe(0);
  expect(spawnSync('git', ['-C', mirror, 'config', 'remote.origin.mirror', 'true']).status).toBe(0);
  expect(
    spawnSync('git', ['-C', mirror, 'config', '--unset-all', 'remote.origin.fetch']).status
  ).toBe(0);
  expect(
    spawnSync('git', ['-C', mirror, 'config', '--add', 'remote.origin.fetch', '+refs/*:refs/*'])
      .status
  ).toBe(0);

  const localRefs = spawnSync(
    'git',
    ['-C', mirror, 'for-each-ref', '--format=%(refname) %(objectname)'],
    { encoding: 'utf8' }
  )
    .stdout.trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [ref, oid] = line.split(' ');
      return `${oid}\t${ref}`;
    })
    .sort()
    .join('\n');
  fs.writeFileSync(liveRefs, `${localRefs}\n`);
  fs.writeFileSync(liveCalls, '0');

  return {
    temporaryRoot,
    mirror,
    liveRefs,
    environment: {
      ...process.env,
      PATH: `${fakeBin}:${process.env.PATH}`,
      LIVE_REFS: liveRefs,
      LIVE_CALLS: liveCalls,
      REAL_GIT: realGit,
    },
  };
}

function runReleaseFixture(fixture, extraEnvironment = {}) {
  return spawnSync(audit, [fixture.mirror, 'release-mirror'], {
    cwd: root,
    env: { ...fixture.environment, ...extraEnvironment },
    encoding: 'utf8',
  });
}

describe('history audit preparation', () => {
  test('aggregates and sorts counts without exposing report fields', () => {
    const result = summarize([
      { RuleID: 'jwt', File: 'z/file.js', Secret: 'never-print', Commit: 'never-print' },
      { RuleID: 'generic-api-key', File: 'a/file.js', Match: 'never-print' },
      { RuleID: 'jwt', File: 'a/file.js', Fingerprint: 'never-print' },
      { RuleID: 'jwt.2', File: 'z/file.js' },
      { RuleID: 'jwt-1', File: 'z/file.js' },
    ]);
    expect(result.status).toBe(0);
    expect(result.stdout).toBe(
      '{"total":5,"byRuleId":{"generic-api-key":1,"jwt":2,"jwt-1":1,"jwt.2":1},"byPath":{"a/file.js":2,"z/file.js":3}}\n'
    );
    expect(result.stdout).not.toMatch(/never-print|Secret|Commit|Match|Fingerprint/);
  });

  test.each([
    ['malformed JSON', '{'],
    ['schema object', '{}'],
    ['missing rule', '[{"File":"safe.js"}]'],
    ['control path', '[{"RuleID":"x","File":"safe\\u0000.js"}]'],
    ['backslash path', '[{"RuleID":"x","File":"safe\\\\file.js"}]'],
    ['traversal path', '[{"RuleID":"x","File":"../safe.js"}]'],
    ['dot-segment path', '[{"RuleID":"x","File":"safe/./file.js"}]'],
    ['drive path', '[{"RuleID":"x","File":"C:/safe.js"}]'],
    ['colon path', '[{"RuleID":"x","File":"safe:file.js"}]'],
    ['absolute path', '[{"RuleID":"x","File":"/safe.js"}]'],
    ['uppercase rule id', '[{"RuleID":"JWT","File":"safe.js"}]'],
    ['spaced rule id', '[{"RuleID":"bad rule","File":"safe.js"}]'],
    ['slash rule id', '[{"RuleID":"bad/rule","File":"safe.js"}]'],
    ['colon rule id', '[{"RuleID":"bad:rule","File":"safe.js"}]'],
    ['unicode rule id', '[{"RuleID":"jwt-✓","File":"safe.js"}]'],
    ['long rule id', `[{"RuleID":"${'a'.repeat(129)}","File":"safe.js"}]`],
  ])('rejects %s fail-closed', (_name, input) => {
    const result = spawnSync(process.execPath, [summarizer], {
      cwd: root,
      input,
      encoding: 'utf8',
    });
    expect(result.status).toBe(2);
    expect(result.stdout).toBe('');
  });

  test('script has explicit modes, pinned version, no report file, and no destructive git operations', () => {
    const source = fs.readFileSync(audit, 'utf8');
    expect(source).toContain("expected_version='8.30.1'");
    expect(source).toMatch(/local-baseline.*release-mirror/);
    expect(source).toContain('--report-format json --report-path - --log-opts=');
    expect(source).not.toContain('--report-path /dev/stdout');
    expect(source).toContain('remote.origin.mirror');
    expect(source).toContain("== 'true'");
    expect(source).not.toMatch(/mktemp|checkout|reset|filter-repo|force-push|git fetch/);
    expect(spawnSync('bash', ['-n', audit]).status).toBe(0);
  });

  test('script rejects missing and unsupported arguments before scanning', () => {
    expect(spawnSync(audit, [], { cwd: root, encoding: 'utf8' }).status).toBe(2);
    expect(
      spawnSync(audit, [root, 'unsupported-mode'], { cwd: root, encoding: 'utf8' }).status
    ).toBe(2);
  });

  test('release-mirror requires the mirror flag and accepts a compliant local fixture', () => {
    const fixture = makeReleaseFixture();
    try {
      expect(
        spawnSync('git', ['-C', fixture.mirror, 'config', 'remote.origin.mirror', 'false']).status
      ).toBe(0);
      expect(runReleaseFixture(fixture).status).toBe(2);
      expect(
        spawnSync('git', ['-C', fixture.mirror, 'config', 'remote.origin.mirror', 'true']).status
      ).toBe(0);
      const compliant = runReleaseFixture(fixture);
      expect(compliant.status).toBe(0);
      expect(compliant.stdout).toContain('refs heads=1 tags=0 pull=1 other=0 reachable-commits=1');
      expect(compliant.stdout).toContain('{"total":0,"byRuleId":{},"byPath":{}}');
    } finally {
      fs.rmSync(fixture.temporaryRoot, { recursive: true, force: true });
    }
  });

  test.each([
    [
      'misleading fetch refspec',
      (fixture) => {
        spawnSync('git', ['-C', fixture.mirror, 'config', '--unset-all', 'remote.origin.fetch']);
        spawnSync('git', [
          '-C',
          fixture.mirror,
          'config',
          '--add',
          'remote.origin.fetch',
          'x+refs/*:refs/*',
        ]);
      },
    ],
    [
      'wrong canonical origin',
      (fixture) => {
        spawnSync('git', [
          '-C',
          fixture.mirror,
          'remote',
          'set-url',
          'origin',
          'https://evil.example/mobile-apps.git',
        ]);
      },
    ],
  ])('rejects %s before scanning', (_name, mutate) => {
    const fixture = makeReleaseFixture();
    try {
      mutate(fixture);
      const result = runReleaseFixture(fixture);
      expect(result.status).toBe(2);
      expect(result.stdout).toBe('');
    } finally {
      fs.rmSync(fixture.temporaryRoot, { recursive: true, force: true });
    }
  });

  test.each([
    [
      'missing local/live ref',
      (fixture) => {
        const live = fs.readFileSync(fixture.liveRefs, 'utf8').trim().split('\n');
        fs.writeFileSync(fixture.liveRefs, `${live.slice(1).join('\n')}\n`);
      },
    ],
    [
      'extra local/live ref',
      (fixture) => {
        fs.appendFileSync(fixture.liveRefs, `${'a'.repeat(40)}\trefs/tags/injected\n`);
      },
    ],
  ])('rejects %s mismatch without printing refs', (_name, mutate) => {
    const fixture = makeReleaseFixture();
    try {
      mutate(fixture);
      const result = runReleaseFixture(fixture);
      expect(result.status).toBe(11);
      expect(result.stdout).toBe('');
      expect(result.stderr).not.toMatch(/refs\/|[0-9a-f]{40}/);
    } finally {
      fs.rmSync(fixture.temporaryRoot, { recursive: true, force: true });
    }
  });

  test('preserves scanner finding status while suppressing scanner stderr', () => {
    const fixture = makeReleaseFixture({
      report: '[{"RuleID":"jwt","File":"safe.js","Secret":"hidden"}]\n',
      scannerExit: 1,
      scannerStderr: 'scanner-secret-marker',
    });
    try {
      const result = runReleaseFixture(fixture);
      expect(result.status).toBe(1);
      expect(result.stdout).toContain('{"total":1,"byRuleId":{"jwt":1},"byPath":{"safe.js":1}}');
      expect(result.stdout).not.toContain('hidden');
      expect(result.stderr).not.toContain('scanner-secret-marker');
    } finally {
      fs.rmSync(fixture.temporaryRoot, { recursive: true, force: true });
    }
  });

  test.each([
    [
      'unexpected scanner exit',
      { report: '[]\n', scannerExit: 7 },
      4,
      'History audit scanner failed unexpectedly.',
    ],
    [
      'malformed JSON',
      { report: '{\n', scannerExit: 0 },
      3,
      'History audit summarizer failed closed.',
    ],
    [
      'partial JSON',
      { report: '[{"RuleID":"jwt"}\n', scannerExit: 0 },
      3,
      'History audit summarizer failed closed.',
    ],
  ])('%s remains distinguishable', (_name, options, expectedStatus, expectedError) => {
    const fixture = makeReleaseFixture(options);
    try {
      const result = runReleaseFixture(fixture);
      expect(result.status).toBe(expectedStatus);
      expect(result.stderr).toContain(expectedError);
    } finally {
      fs.rmSync(fixture.temporaryRoot, { recursive: true, force: true });
    }
  });

  test('rejects a live ref set that changes after scanning', () => {
    const fixture = makeReleaseFixture();
    const changedRefs = fs
      .readFileSync(fixture.liveRefs, 'utf8')
      .replace(/^[0-9a-f]+(?=\t)/, 'b'.repeat(40));
    const changedFile = path.join(fixture.temporaryRoot, 'changed-refs');
    fs.writeFileSync(changedFile, changedRefs);
    try {
      const result = runReleaseFixture(fixture, { LIVE_CHANGE_FILE: changedFile });
      expect(result.status).toBe(13);
      expect(result.stderr).toContain('Canonical origin refs changed during scan.');
    } finally {
      fs.rmSync(fixture.temporaryRoot, { recursive: true, force: true });
    }
  });

  test('rejects a local mirror ref set that changes during scanning', () => {
    const fixture = makeReleaseFixture();
    const mainRevision = spawnSync('git', ['-C', fixture.mirror, 'rev-parse', 'refs/heads/main'], {
      encoding: 'utf8',
    }).stdout.trim();
    try {
      const result = runReleaseFixture(fixture, {
        LOCAL_CHANGE_REPOSITORY: fixture.mirror,
        LOCAL_CHANGE_OID: mainRevision,
      });
      expect(result.status).toBe(14);
      expect(result.stderr).toContain('Mirror refs changed during scan.');
      expect(result.stderr).not.toMatch(/refs\/tags|[0-9a-f]{40}/);
    } finally {
      fs.rmSync(fixture.temporaryRoot, { recursive: true, force: true });
    }
  });
});
