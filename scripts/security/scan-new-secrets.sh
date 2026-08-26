#!/usr/bin/env bash

set -euo pipefail

readonly expected_version='8.30.1'
readonly base_sha="${1:-}"
readonly head_sha="${2:-}"

umask 077

scan_dir=$(mktemp -d)
gitleaks_tmp_dir=$(mktemp -d)
gitleaks_output="${gitleaks_tmp_dir}/gitleaks-output"

cleanup() {
    rm -rf "${scan_dir}"
    rm -rf "${gitleaks_tmp_dir}"
}

trap cleanup EXIT

if ! command -v gitleaks >/dev/null 2>&1; then
    echo "Gitleaks ${expected_version} is required." >&2
    exit 127
fi

if [[ "$(gitleaks version 2>/dev/null)" != "${expected_version}" ]]; then
    echo "Expected Gitleaks ${expected_version}." >&2
    exit 2
fi

if [[ ! "${base_sha}" =~ ^[0-9a-f]{40}$ ]] || [[ ! "${head_sha}" =~ ^[0-9a-f]{40}$ ]]; then
    echo 'Both base and head must be full lowercase Git commit SHAs.' >&2
    exit 2
fi

if ! git cat-file -e "${head_sha}^{commit}" >/dev/null 2>&1; then
    echo 'The supplied head revision is not a Git commit in this repository.' >&2
    exit 2
fi

if [[ "${base_sha}" == '0000000000000000000000000000000000000000' ]]; then
    scan_log_opts="${head_sha}"
else
    if ! git cat-file -e "${base_sha}^{commit}" >/dev/null 2>&1; then
        echo 'The supplied base revision is not a Git commit in this repository.' >&2
        exit 2
    fi

    if ! scan_base=$(git merge-base "${base_sha}" "${head_sha}"); then
        echo 'The supplied revisions do not share a Git history.' >&2
        exit 2
    fi

    if [[ -z "${scan_base}" ]]; then
        echo 'The supplied revisions do not share a Git history.' >&2
        exit 2
    fi

    scan_log_opts="${scan_base}..${head_sha}"
fi

run_gitleaks() {
    local status

    if gitleaks "$@" >"${gitleaks_output}" 2>&1; then
        return 0
    else
        status=$?
    fi

    if [[ "${status}" -eq 1 ]]; then
        echo 'Gitleaks found potential secrets; run the scan locally for details.' >&2
    else
        echo 'Gitleaks scanner failed.' >&2
    fi
    return "${status}"
}

run_gitleaks git \
    --redact \
    --no-banner \
    --exit-code 1 \
    --config .gitleaks.toml \
    --log-opts="${scan_log_opts}" \
    .

git archive "${head_sha}" | tar -x -C "${scan_dir}"

run_gitleaks dir \
    --redact \
    --no-banner \
    --exit-code 1 \
    --config .gitleaks.toml \
    --max-target-megabytes=20 \
    "${scan_dir}"
