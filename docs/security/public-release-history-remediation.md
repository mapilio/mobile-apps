# Public-Release History Remediation

This runbook records the selected controlled release procedure for issue #83.
Use a restricted channel for every finding or evidence package. Do not put
secret material, replacement expressions, matches, fingerprints, commit
identifiers tied to findings, or line numbers in tickets, logs, screenshots,
or this repository.

## Current baseline

The current safe baseline is **18 redacted findings**: **17 generic-api-key**
and **1 jwt**, across the six paths already public in the issue evidence. This
does not confirm that any credential is active. On 2026-08-19, the observed
repository inventory was **18 remote heads, 0 tags, and 58 individual
`refs/pull/*` refs**; 58 is not a count of pull requests. Recheck all counts,
forks, open PRs, and protection/rules at execution; these numbers are not a
release artifact.

## Gates before any rewrite

1. The credential owner inventory is complete. Historical credential rotation
   remains an operational security and binary-rollout task tracked under #84;
   do not claim it is complete in this release procedure. Record status in
   restricted evidence, without values.
2. Deployed social authentication works through the backend-first flow. Run
   real provider smoke tests and an adoption gate for existing users before
   changing history.
3. Restrict issue #83 evidence and preserve only the minimum redacted evidence.
   Freeze new changes and close or explicitly disposition open PRs.
4. At execution, inventory branches, tags, forks, open PRs, and all individual
   pull-request refs again. Obtain an immutable restricted backup and verify it
   without exposing identifiers tied to findings. Recheck branch protection and
   repository rules as part of that inventory.
5. In a disposable mirror, run a dry-run with `git-filter-repo` **>= 2.47**
   using the approved restricted procedure. Review changed refs and every
   affected PR. Do not place replacement expressions in source control.
6. Run a zero-finding, all-ref redacted audit from a fresh release mirror with
   `scripts/security/audit-all-history.sh PATH release-mirror`. The local
   baseline mode is for preparation only. This release audit requires
   read-only GitHub access, a maintenance freeze, and an exact live ref-set
   comparison before and after the scan.
7. Confirm the release owner has reviewed the restricted evidence and the
   selected fresh-snapshot procedure.

The audit script can attest only to the canonical repository's live refs, the
mirror's matching refs, and its aggregate scan result. It cannot validate
forks, open-PR completeness, branch protection or repository rules, credential
rotation, GitHub Support outcomes, or either person's approval. Those remain
separate restricted attestations and release gates.

## Safe preparation example

The following commands create and refresh a new restricted disposable mirror.
They are preparation only: use a repository URL and local path supplied through
the restricted procedure, and do not publish the mirror.

```bash
git clone --mirror REPOSITORY_URL RESTRICTED_DISPOSABLE_MIRROR
git -C RESTRICTED_DISPOSABLE_MIRROR config --get remote.origin.mirror
git -C RESTRICTED_DISPOSABLE_MIRROR fetch --prune --no-tags origin '+refs/*:refs/*'
bash scripts/security/audit-all-history.sh RESTRICTED_DISPOSABLE_MIRROR release-mirror
```

The fetch is a read-only source operation that refreshes only the disposable
mirror; the audit script itself never fetches or mutates refs. History mutation
steps live only in the approved restricted procedure and are intentionally not
included here.

## Abort conditions

Abort on any unowned credential requiring restricted incident handling,
social-auth smoke or adoption failure, incomplete ref/fork/PR inventory, backup
verification issue, unexpected changed ref, nonzero all-ref audit, unavailable
GitHub support path, unclear protection state, or any attempt to log sensitive
scanner output. Track credential rotation and binary rollout status under #84.

## Selected fresh-snapshot publication path

Keep the current repository private under an archive name as an immutable
restricted record. Create a new public repository at the canonical
`mapilio/mobile-apps` URL and publish one clean root snapshot only. Do not copy
old branches, tags, pull refs, or Git objects. The canonical URL is reused
after the private repository is renamed and the new repository is created.

Before publication, scan the exact snapshot and retain restricted evidence of
the current snapshot scan result. Recreate repository settings, branch
protection, rules, access restrictions, and other required controls on the new
repository, then verify them after publication. The first push must use the
zero-base path in `scripts/security/scan-new-secrets.sh`, which scans all
history reachable from the new root and then scans the tracked tree archive.

This procedure intentionally loses pull-request, issue, branch, tag, commit,
and other historical continuity. Record those continuity limitations clearly
for collaborators and users. Existing clones must be freshly cloned from the
new public repository; do not pull from the archived repository. Monitor
post-release access, provider sign-in, builds, and scanning. If a credential
reappears, stop publication and follow the restricted incident procedure.

Read GitHub's [Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
guidance as background for the archived private record and release controls.
