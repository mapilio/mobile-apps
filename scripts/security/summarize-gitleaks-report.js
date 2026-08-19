'use strict';

const fs = require('node:fs');

const input = fs.readFileSync(0, 'utf8');

function fail(message) {
  process.stderr.write(`History audit report rejected: ${message}.\n`);
  process.exit(2);
}

function portableText(value, field) {
  if (typeof value !== 'string' || value.length === 0 || value.length > 4096) {
    fail(`invalid ${field}`);
  }
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code < 0x20 || code === 0x7f || code === 0xfffe || code === 0xffff) {
      fail(`nonportable ${field}`);
    }
  }
  return value;
}

function normalizedPath(value) {
  const path = portableText(value, 'repository path');
  if (
    path.includes('\\') ||
    path.includes(':') ||
    path.startsWith('/') ||
    path.includes('//') ||
    /^[A-Za-z]:/.test(path)
  ) {
    fail('nonportable repository path');
  }
  const parts = path.split('/');
  if (parts.some((part) => part === '' || part === '.' || part === '..')) {
    fail('traversal repository path');
  }
  return parts.join('/');
}

function ruleId(value) {
  const id = portableText(value, 'rule id');
  if (!/^[a-z0-9][a-z0-9._-]{0,127}$/.test(id)) fail('nonportable rule id');
  return id;
}

let report;
try {
  report = JSON.parse(input);
} catch {
  fail('malformed JSON');
}

if (!Array.isArray(report)) fail('report must be an array');

const byRuleId = new Map();
const byPath = new Map();

for (const finding of report) {
  if (!finding || typeof finding !== 'object' || Array.isArray(finding)) {
    fail('finding must be an object');
  }
  // Read only aggregation fields. Secret-bearing report fields never enter output.
  const id = ruleId(finding.RuleID);
  const file = normalizedPath(finding.File);
  byRuleId.set(id, (byRuleId.get(id) || 0) + 1);
  byPath.set(file, (byPath.get(file) || 0) + 1);
}

const codeUnitCompare = (left, right) => {
  const length = Math.min(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    if (left.charCodeAt(index) !== right.charCodeAt(index)) {
      return left.charCodeAt(index) - right.charCodeAt(index);
    }
  }
  return left.length - right.length;
};

const sortCounts = (counts) =>
  Object.fromEntries([...counts.entries()].sort(([left], [right]) => codeUnitCompare(left, right)));

process.stdout.write(
  `${JSON.stringify({
    total: report.length,
    byRuleId: sortCounts(byRuleId),
    byPath: sortCounts(byPath),
  })}\n`
);
