# Public-Release History Remediation

This runbook is a controlled preparation and release gate for issue #83. It
does not authorize publication by itself. Use a restricted channel for every
finding or evidence package. Do not put secret material, replacement
expressions, matches, fingerprints, commit identifiers tied to findings, or
line numbers in tickets, logs, screenshots, or this repository.

## Current baseline

The current safe baseline is **18 redacted findings**: **17 generic-api-key**
and **1 jwt**, across the six paths already public in the issue evidence. This
does not confirm that any credential is active. On 2026-08-19, the observed
repository inventory was **18 remote heads, 0 tags, and 58 individual
`refs/pull/*` refs**; 58 is not a count of pull requests. Recheck all counts,
forks, open PRs, and protection/rules at execution; these numbers are not a
release artifact.

## Gates before any rewrite

1. The credential owner inventory is complete, and owners revoke or rotate
   every potentially affected credential first. Record status in restricted
   evidence, without values.
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
7. Obtain two-person approval from the security owner and repository owner.

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

Abort on any unowned credential, failed revoke/rotate, social-auth smoke or
adoption failure, incomplete ref/fork/PR inventory, backup verification issue,
unexpected changed ref, nonzero all-ref audit, unavailable GitHub support path,
unclear protection state, or any attempt to log sensitive scanner output.

## Same-repository publication path

Only in an approved maintenance window, perform the same-repository force
update after the dry-run and approvals. Restore branch protection and rules
immediately, then rerun the all-ref audit and review changed refs and affected
PRs. Contact [GitHub Support](https://support.github.com/) for cached views or
read-only PR refs when the case is eligible; rewriting does not guarantee
removal from every cache.

Every collaborator must re-clone after the rewrite; never pull the old clone.
Monitor post-release access, provider sign-in, builds, and scanning. If a
credential reappears, stop publication, revoke or rotate it, preserve restricted
evidence, identify the recontamination source, and repeat the approved audit
and remediation gate.

## Safer alternative

When the owner accepts losing or transferring PR, issue, and history
continuity, a fresh clean public repository is safer than rewriting the
existing one. Keep the old repository restricted as the immutable record and
make continuity limitations explicit to users.

Read GitHub's [Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
guidance before choosing the path.
