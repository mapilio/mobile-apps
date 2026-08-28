# Public-Release History Remediation

This runbook defines the selected same-repository history rewrite. Use a
restricted channel for every finding, replacement map, and evidence package.
Never place secret values, matches, fingerprints, sensitive source lines, or
unredacted scanner output in tickets, logs, screenshots, or this repository.

Git history cleanup is not credential revocation. Revoke or rotate every secret
that may still be valid before rewriting the remote repository.

## Release model

The existing canonical `mapilio/mobile-apps` repository remains in place. Its
branches and useful development history are preserved, but commits that descend
from the first affected commit receive new hashes after the sensitive values are
replaced. The current approved `main` tree must remain byte-identical.

The clean-root staging repository is a private rollback fallback only. It must
not be made public or transferred while this rewrite path is active.

## Known restricted dry-run result

The 28 August 2026 dry run used `git-filter-repo` 2.47.0 and Gitleaks 8.30.1:

- 18 findings across 9 unique values and 6 paths became zero findings;
- 1,231 of 1,496 reachable commits changed;
- all 24 branch refs and 80 pull refs changed;
- all 104 ref names were preserved;
- 79 pull-request head refs and 1 pull-request merge ref were affected;
- the repository reported zero forks; this must be rechecked during the freeze;
- the current `main` tree stayed byte-identical;
- `git fsck --full --no-reflogs` passed.

A global replacement attempt also reached zero findings but changed current
native Facebook configuration. It was rejected. Only the path-scoped procedure
described below is accepted.

## Paths in scope

Replacement is limited to the six paths reported by the redacted audit:

- `android/gradle.properties`
- `app.json`
- `components/SocialLogin/FacebookLogin.js`
- `highordercomponents/MapView.js`
- `ios/Podfile`
- `ios/sentry.properties`

Do not broaden this list without a new redacted finding and another dry run.

## Required release gates

1. Revoke or rotate the superseded Sentry auth tokens, Mapbox download tokens,
   and MapTiler keys. Keep the intentionally shipped Facebook client token
   documented as public-client configuration. Treat the historical Apple
   identity-token sample as sensitive user data even though it is short-lived.
2. Announce a write freeze. Record the current repository visibility, default
   branch, collaborators, forks, open pull requests, branch protections,
   rulesets, Actions permissions, security settings, and every live ref. Require
   zero affected forks before continuing. If an affected fork exists, coordinate
   its deletion or equivalent history cleanup with its maintainer and GitHub
   Support; do not publish while it can still expose the old objects.
3. Create and verify a restricted mirror backup and bundle. The backup is for
   investigation and emergency recovery; never push its unclean history back to
   GitHub after the rewrite.
4. Install `git-filter-repo` 2.47.0 or newer and the repository-pinned Gitleaks
   8.30.1. Reject a different scanner version.
5. During the freeze, create a fresh mirror from the canonical repository and
   fetch the full ref namespace. Compare its complete ref/object inventory with
   `git ls-remote --refs` before continuing. Recheck that the affected fork
   count is still zero.
6. Generate an unredacted replacement map only inside the restricted evidence
   directory. Set directory mode `0700` and file mode `0600`. The map must
   contain the nine verified literal values and must never be committed.
7. Run `git-filter-repo --sensitive-data-removal` with `--replace-text` and a
   `--file-info-callback` that calls `value.apply_replace_text()` only for the
   six paths above. Never use a global `--replace-text` rewrite for this repo.
8. Retain the non-sensitive `changed-refs` summary and first changed commit from
   `git-filter-repo`. Count affected pull-request head refs without publishing
   their old object IDs.
9. In the local rewritten mirror, require all ref names to match the complete
   pre-rewrite inventory. Record two separate remote expectations: every branch
   and tag ref name must be preserved; every affected pull ref and cached view
   must be dereferenced by GitHub Support. Require the new `main` tree ID to
   equal the recorded pre-rewrite `main` tree ID. Run the redacted all-history
   Gitleaks audit and require zero findings, then run
   `git fsck --full --no-reflogs`.
10. Review the rewritten `main` tree and run the normal release gate. Because
    the tree must be identical, any application-file diff is an immediate abort.
11. Record current protections, then temporarily relax only the controls that
    prevent the designated account from performing the mirror force-push. Keep
    the repository private and keep every other writer frozen.
12. Force-push the rewritten branches and tags from the verified mirror.
    GitHub pull refs are read-only; failures for those refs are expected, while
    a failure for any branch or tag is an abort condition.
13. Contact GitHub Support using the repository name, affected pull-request
    count, first changed commit, and any LFS orphan note reported by
    `git-filter-repo`. Request dereferencing of cached views and pull-request
    references. Record the expected post-Support pull-ref inventory and require
    the affected old refs and cached commit views to become inaccessible.
    GitHub Support may require proof that real credentials were revoked or
    rotated.
14. Recreate or rebase the open accessibility pull request on the cleaned
    history after its changes are tested. Do not merge an old PR head into the
    rewritten history.
15. Require collaborators, CI checkouts, deployment checkouts, and local
    worktrees to discard their old clones and clone again. Never pull, merge,
    rebase, or push from an old clone after cutover.
16. Restore and verify branch protections, rulesets, required checks, Actions
    permissions, secret scanning, push protection, dependency security, private
    vulnerability reporting, collaborators, and the default branch.
17. From a fresh clone, verify the exact branch/tag ref-name inventory, the
    approved `main` tree, the expected post-Support pull-ref state, a zero
    all-history scan, `git fsck`, and the complete release gate. Only then make
    the canonical repository public and repeat the settings/security check.

## Continuity warning

Commit hashes at and after the first changed commit will change. Old commit
signatures and tag signatures in the rewritten range are removed. Direct commit
links, comparisons, releases, deployment pins, submodule pins, and pull-request
diffs may need repair. Issues and repository identity remain in place.

Every old clone can re-contaminate the cleaned repository. Fresh clones are a
release requirement, not a suggestion.

## Abort criteria

Abort before force-push if credential rotation is incomplete; the write freeze
is not effective; the fresh mirror differs from live refs; any affected fork
exists or cannot be cleaned; the replacement scope or count changes without
review; the current `main` tree ID changes; any local mirror ref name disappears
or appears; Gitleaks is nonzero; `git fsck` fails; the application release gate
fails; or sensitive output reaches an unrestricted location.

After the first force-push, keep the repository private and frozen if any
branch/tag update fails, a branch/tag ref name changes unexpectedly, Support
cleanup is unavailable or leaves an affected pull ref/cache accessible,
protections cannot be restored, an old clone pushes, or final verification
fails. Do not solve a partial rewrite by pushing the unclean backup. Rebuild the
candidate from the restricted backup or a fresh exact mirror, re-run every gate,
and complete or quarantine the rewrite under the security incident process.

## Operational rollout after publication

Smoke-test Google, Facebook, Apple, and OpenStreetMap against the deployed
backend-first authentication flow. Complete installed-build credential rotation
and adoption monitoring through the store-release issue. This operational work
does not permit old Git objects or old clones to re-enter the cleaned repository.

GitHub's [Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
guidance is the controlling external reference for the force-push, Support, and
clone-cleanup steps.
