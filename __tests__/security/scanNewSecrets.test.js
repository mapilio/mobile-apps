const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '../..');
const scanner = path.join(root, 'scripts/security/scan-new-secrets.sh');
const zeroSha = '0'.repeat(40);

function git(cwd, args) {
  return spawnSync('git', args, { cwd, encoding: 'utf8' });
}

function commit(repo, message) {
  const result = git(repo, [
    '-c',
    'user.name=Test',
    '-c',
    'user.email=test@example.invalid',
    'commit',
    '--allow-empty',
    '-qm',
    message,
  ]);
  expect(result.status).toBe(0);
  return git(repo, ['rev-parse', 'HEAD']).stdout.trim();
}

function makeFixture() {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'scan-new-secrets-'));
  const repo = path.join(temporaryRoot, 'repo');
  const unrelated = path.join(temporaryRoot, 'unrelated');
  const bin = path.join(temporaryRoot, 'bin');
  const calls = path.join(temporaryRoot, 'calls');
  const evidenceFile = path.join(temporaryRoot, 'evidence');
  const gitleaks = path.join(bin, 'gitleaks');

  fs.mkdirSync(repo);
  fs.mkdirSync(unrelated);
  fs.mkdirSync(bin);
  fs.writeFileSync(
    gitleaks,
    `#!/bin/sh
printf '%s\n' "$*" >> "$GITLEAKS_CALLS"
if [ "$1" = version ]; then
  printf 'SECRET_MATERIAL /sensitive/path fingerprint=abc123\n' >&2
  printf '8.30.1\n'
  exit 0
fi

printf 'SECRET_MATERIAL /sensitive/path fingerprint=abc123\n'
printf 'SECRET_MATERIAL /sensitive/path fingerprint=abc123\n' >&2

if [ "$1" = git ]; then
  for argument in "$@"; do
    case "$argument" in
      --log-opts=*) log_opts=\${argument#--log-opts=} ;;
    esac
  done
  printf 'git-revision-count=%s\n' "$(git rev-list --count "$log_opts")" >> "$GITLEAKS_EVIDENCE"
else
  scan_path=''
  for argument in "$@"; do scan_path=$argument; done
  if [ -f "$scan_path/marker.txt" ]; then
    printf 'directory-marker=present\n' >> "$GITLEAKS_EVIDENCE"
  else
    printf 'directory-marker=missing\n' >> "$GITLEAKS_EVIDENCE"
  fi
fi
exit "\${GITLEAKS_EXIT:-0}"
`,
    { mode: 0o755 }
  );
  fs.writeFileSync(evidenceFile, '');

  for (const directory of [repo, unrelated]) {
    expect(git(directory, ['init', '-q']).status).toBe(0);
  }

  return {
    temporaryRoot,
    repo,
    unrelated,
    calls,
    environment: {
      ...process.env,
      PATH: `${bin}:${process.env.PATH}`,
      GITLEAKS_CALLS: calls,
      GITLEAKS_EVIDENCE: evidenceFile,
    },
  };
}

function run(fixture, base, head) {
  return spawnSync('bash', [scanner, base, head], {
    cwd: fixture.repo,
    env: fixture.environment,
    encoding: 'utf8',
  });
}

function calls(fixture) {
  return fs.existsSync(fixture.calls)
    ? fs.readFileSync(fixture.calls, 'utf8').trim().split('\n')
    : [];
}

function evidence(fixture) {
  return fs.readFileSync(fixture.environment.GITLEAKS_EVIDENCE, 'utf8');
}

describe('scan-new-secrets first-push and revision handling', () => {
  test('scans all reachable history and the tracked tree for a zero-base root push', () => {
    const fixture = makeFixture();
    try {
      fs.writeFileSync(path.join(fixture.repo, 'marker.txt'), 'tracked marker\n');
      expect(git(fixture.repo, ['add', 'marker.txt']).status).toBe(0);
      commit(fixture.repo, 'root');
      commit(fixture.repo, 'second');
      const head = commit(fixture.repo, 'third');
      const result = run(fixture, zeroSha, head);

      expect(result.status).toBe(0);
      expect(evidence(fixture)).toContain('git-revision-count=3');
      expect(evidence(fixture)).toContain('directory-marker=present');
      const recordedCalls = calls(fixture);
      expect(recordedCalls).toHaveLength(3);
      expect(recordedCalls[0]).toBe('version');
      expect(recordedCalls[1]).toBe(
        `git --redact --no-banner --exit-code 1 --config .gitleaks.toml --log-opts=${head} .`
      );
      expect(recordedCalls[2]).toMatch(/^dir --redact .*--max-target-megabytes=20 /);
      expect(recordedCalls[2]).not.toContain('--verbose');
      expect(`${result.stdout}${result.stderr}`).not.toContain('SECRET_MATERIAL');
    } finally {
      fs.rmSync(fixture.temporaryRoot, { recursive: true, force: true });
    }
  });

  test('preserves the merge-base revision range for normal shared history', () => {
    const fixture = makeFixture();
    try {
      const base = commit(fixture.repo, 'base');
      commit(fixture.repo, 'middle');
      const head = commit(fixture.repo, 'head');
      const result = run(fixture, base, head);

      expect(result.status).toBe(0);
      expect(evidence(fixture)).toContain('git-revision-count=2');
      expect(calls(fixture)[1]).toContain(`--log-opts=${base}..${head}`);
      expect(`${result.stdout}${result.stderr}`).not.toContain('SECRET_MATERIAL');
    } finally {
      fs.rmSync(fixture.temporaryRoot, { recursive: true, force: true });
    }
  });

  test('scans the full new history when a force-push base is no longer available', () => {
    const fixture = makeFixture();
    try {
      commit(fixture.repo, 'root');
      commit(fixture.repo, 'second');
      const head = commit(fixture.repo, 'third');
      const result = run(fixture, '2'.repeat(40), head);

      expect(result.status).toBe(0);
      expect(evidence(fixture)).toContain('git-revision-count=3');
      expect(calls(fixture)[1]).toContain(`--log-opts=${head}`);
      expect(`${result.stdout}${result.stderr}`).not.toContain('SECRET_MATERIAL');
    } finally {
      fs.rmSync(fixture.temporaryRoot, { recursive: true, force: true });
    }
  });

  test.each([
    ['invalid base', 'not-a-sha', '0'.repeat(40)],
    ['missing head', zeroSha, '1'.repeat(40)],
  ])('rejects %s before invoking the scanner', (_name, base, head) => {
    const fixture = makeFixture();
    try {
      const actualHead = commit(fixture.repo, 'root');
      const result = run(fixture, base, head === zeroSha ? actualHead : head);

      expect(result.status).toBe(2);
      expect(calls(fixture)).toEqual(['version']);
      expect(`${result.stdout}${result.stderr}`).not.toContain('SECRET_MATERIAL');
    } finally {
      fs.rmSync(fixture.temporaryRoot, { recursive: true, force: true });
    }
  });

  test('rejects an invalid nonzero base with unrelated history', () => {
    const fixture = makeFixture();
    try {
      const head = commit(fixture.repo, 'root');
      const unrelatedBase = commit(fixture.unrelated, 'unrelated');
      expect(
        git(fixture.repo, [
          'fetch',
          '-q',
          fixture.unrelated,
          `${unrelatedBase}:refs/heads/unrelated`,
        ]).status
      ).toBe(0);
      const result = run(fixture, unrelatedBase, head);

      expect(result.status).toBe(2);
      expect(calls(fixture)).toEqual(['version']);
      expect(`${result.stdout}${result.stderr}`).not.toContain('SECRET_MATERIAL');
    } finally {
      fs.rmSync(fixture.temporaryRoot, { recursive: true, force: true });
    }
  });

  test('hides scanner output and reports findings generically', () => {
    const fixture = makeFixture();
    try {
      const head = commit(fixture.repo, 'root');
      const result = run(
        { ...fixture, environment: { ...fixture.environment, GITLEAKS_EXIT: '1' } },
        zeroSha,
        head
      );

      expect(result.status).toBe(1);
      expect(`${result.stdout}${result.stderr}`).not.toContain('SECRET_MATERIAL');
      expect(result.stderr).toContain(
        'Gitleaks found potential secrets; run the scan locally for details.'
      );
    } finally {
      fs.rmSync(fixture.temporaryRoot, { recursive: true, force: true });
    }
  });
});
