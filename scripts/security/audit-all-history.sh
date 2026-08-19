#!/usr/bin/env bash

set -euo pipefail

readonly expected_version='8.30.1'
readonly script_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
readonly config_path="${script_dir}/../../.gitleaks.toml"
readonly repository_path="${1:-}"
readonly mode="${2:-}"
readonly canonical_origin_ssh='git@github.com:mapilio/mobile-apps.git'
readonly canonical_origin_ssh_url='ssh://git@github.com/mapilio/mobile-apps.git'
readonly canonical_origin_https='https://github.com/mapilio/mobile-apps.git'

usage() {
    printf '%s\n' 'Usage: audit-all-history.sh REPOSITORY_PATH local-baseline|release-mirror' >&2
    exit 2
}

[[ $# -eq 2 ]] || usage
[[ -d "${repository_path}" ]] || { printf '%s\n' 'Repository path must be a directory.' >&2; exit 2; }
[[ "${mode}" == 'local-baseline' || "${mode}" == 'release-mirror' ]] || usage

if ! command -v gitleaks >/dev/null 2>&1; then
    printf 'Gitleaks %s is required.\n' "${expected_version}" >&2
    exit 127
fi
if [[ "$(gitleaks version 2>/dev/null)" != "${expected_version}" ]]; then
    printf 'Expected Gitleaks %s.\n' "${expected_version}" >&2
    exit 2
fi

is_shallow=$(git -C "${repository_path}" rev-parse --is-shallow-repository 2>/dev/null) || {
    printf '%s\n' 'Target is not a Git repository.' >&2
    exit 2
}
[[ "${is_shallow}" == 'false' ]] || { printf '%s\n' 'Shallow repositories are rejected.' >&2; exit 2; }
[[ -f "${config_path}" ]] || { printf '%s\n' 'Repository .gitleaks.toml is required.' >&2; exit 2; }

if [[ "${mode}" == 'release-mirror' ]]; then
    [[ "$(git -C "${repository_path}" rev-parse --is-bare-repository 2>/dev/null)" == 'true' ]] || {
        printf '%s\n' 'Release-mirror mode requires a bare mirror.' >&2
        exit 2
    }
    origin_url=$(git -C "${repository_path}" remote get-url origin 2>/dev/null) || {
        printf '%s\n' 'Canonical origin identity could not be read.' >&2
        exit 2
    }
    [[ "${origin_url}" == "${canonical_origin_ssh}" || "${origin_url}" == "${canonical_origin_ssh_url}" || "${origin_url}" == "${canonical_origin_https}" ]] || {
        printf '%s\n' 'Release mirror origin is not the canonical repository.' >&2
        exit 2
    }
    [[ "$(git -C "${repository_path}" config --get remote.origin.mirror 2>/dev/null)" == 'true' ]] || {
        printf '%s\n' 'Release mirror must have remote.origin.mirror=true.' >&2
        exit 2
    }
    fetch_config=$(git -C "${repository_path}" config --get-all remote.origin.fetch 2>/dev/null || true)
    [[ "${fetch_config}" == '+refs/*:refs/*' ]] || {
        printf '%s\n' 'Mirror fetch configuration must exactly cover all refs.' >&2
        exit 2
    }

    set +e
    remote_before_raw=$(git ls-remote --refs "${origin_url}" 2>/dev/null)
    remote_before_status=$?
    set -e
    [[ "${remote_before_status}" -eq 0 ]] || {
        printf '%s\n' 'Canonical origin ref query failed before scan.' >&2
        exit 10
    }
    set +e
    remote_before=$(printf '%s\n' "${remote_before_raw}" | awk 'NF == 2 && $1 ~ /^[0-9a-f]+$/ && $2 ~ /^refs\// {print $2 " " $1; next} {bad=1} END {if (bad) exit 1}' | LC_ALL=C sort)
    remote_normalize_status=$?
    set -e
    [[ "${remote_normalize_status}" -eq 0 ]] || {
        printf '%s\n' 'Canonical origin ref query returned malformed data.' >&2
        exit 10
    }
    set +e
    local_before=$(git -C "${repository_path}" for-each-ref --format='%(refname) %(objectname)' | LC_ALL=C sort)
    local_before_status=$?
    set -e
    [[ "${local_before_status}" -eq 0 ]] || {
        printf '%s\n' 'Mirror ref inventory failed before scan.' >&2
        exit 11
    }
    [[ "${remote_before}" == "${local_before}" ]] || {
        printf '%s\n' 'Mirror refs do not exactly match the canonical origin.' >&2
        exit 11
    }
    heads=$(printf '%s\n' "${remote_before}" | awk '$1 ~ /^refs\/heads\// {n++} END {print n+0}')
    tags=$(printf '%s\n' "${remote_before}" | awk '$1 ~ /^refs\/tags\// {n++} END {print n+0}')
    pulls=$(printf '%s\n' "${remote_before}" | awk '$1 ~ /^refs\/pull\// {n++} END {print n+0}')
    all_refs=$(printf '%s\n' "${remote_before}" | awk 'NF {n++} END {print n+0}')
    [[ "${remote_before}" == *$'refs/heads/main '* ]] || { printf '%s\n' 'Canonical origin lacks refs/heads/main.' >&2; exit 11; }
    [[ "${pulls}" -ge 1 ]] || { printf '%s\n' 'Canonical origin lacks a fetched pull ref.' >&2; exit 11; }
    other=$((all_refs - heads - tags - pulls))
    reachable=$(git -C "${repository_path}" rev-list --all --count)
    printf 'refs heads=%s tags=%s pull=%s other=%s reachable-commits=%s\n' "${heads}" "${tags}" "${pulls}" "${other}" "${reachable}"
fi

set +e
(
    cd "${repository_path}"
    gitleaks git --redact --no-banner --exit-code 1 --config "${config_path}" \
        --report-format json --report-path - --log-opts='--all' 2>/dev/null
) | node "${script_dir}/summarize-gitleaks-report.js"
pipeline_status=("${PIPESTATUS[@]}")
scanner_status="${pipeline_status[0]}"
summarizer_status="${pipeline_status[1]}"
set -e

if [[ "${mode}" == 'release-mirror' ]]; then
    set +e
    local_after=$(git -C "${repository_path}" for-each-ref --format='%(refname) %(objectname)' | LC_ALL=C sort)
    local_after_status=$?
    set -e
    [[ "${local_after_status}" -eq 0 ]] || {
        printf '%s\n' 'Mirror ref inventory failed after scan.' >&2
        exit 14
    }
    set +e
    remote_after_raw=$(git ls-remote --refs "${origin_url}" 2>/dev/null)
    remote_after_status=$?
    set -e
    [[ "${remote_after_status}" -eq 0 ]] || {
        printf '%s\n' 'Canonical origin ref query failed after scan.' >&2
        exit 12
    }
    set +e
    remote_after=$(printf '%s\n' "${remote_after_raw}" | awk 'NF == 2 && $1 ~ /^[0-9a-f]+$/ && $2 ~ /^refs\// {print $2 " " $1; next} {bad=1} END {if (bad) exit 1}' | LC_ALL=C sort)
    remote_normalize_status=$?
    set -e
    [[ "${remote_normalize_status}" -eq 0 ]] || {
        printf '%s\n' 'Canonical origin ref query returned malformed data after scan.' >&2
        exit 12
    }
    [[ "${remote_after}" == "${remote_before}" ]] || {
        printf '%s\n' 'Canonical origin refs changed during scan.' >&2
        exit 13
    }
    [[ "${local_after}" == "${remote_after}" ]] || {
        printf '%s\n' 'Mirror refs changed during scan.' >&2
        exit 14
    }
fi

if [[ "${summarizer_status}" -ne 0 ]]; then
    printf '%s\n' 'History audit summarizer failed closed.' >&2
    exit 3
fi
if [[ "${scanner_status}" -eq 1 ]]; then
    exit 1
fi
if [[ "${scanner_status}" -ne 0 ]]; then
    printf '%s\n' 'History audit scanner failed unexpectedly.' >&2
    exit 4
fi
