#!/usr/bin/env bash

set -euo pipefail

readonly expected_version='8.30.1'
readonly base_sha="${1:-}"
readonly head_sha="${2:-}"

if ! command -v gitleaks >/dev/null 2>&1; then
    echo "Gitleaks ${expected_version} is required." >&2
    exit 127
fi

if [[ "$(gitleaks version)" != "${expected_version}" ]]; then
    echo "Expected Gitleaks ${expected_version}." >&2
    exit 2
fi

if [[ ! "${base_sha}" =~ ^[0-9a-f]{40}$ ]] || [[ ! "${head_sha}" =~ ^[0-9a-f]{40}$ ]]; then
    echo 'Both base and head must be full lowercase Git commit SHAs.' >&2
    exit 2
fi

git cat-file -e "${base_sha}^{commit}"
git cat-file -e "${head_sha}^{commit}"

scan_base=$(git merge-base "${base_sha}" "${head_sha}")

if [[ -z "${scan_base}" ]]; then
    echo 'The supplied revisions do not share a Git history.' >&2
    exit 2
fi

gitleaks git \
    --redact \
    --no-banner \
    --verbose \
    --log-opts="${scan_base}..${head_sha}" \
    .

scan_dir=$(mktemp -d)
trap 'rm -rf "${scan_dir}"' EXIT

git archive "${head_sha}" | tar -x -C "${scan_dir}"

gitleaks dir \
    --redact \
    --no-banner \
    --verbose \
    --max-target-megabytes=20 \
    "${scan_dir}"
