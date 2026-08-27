# Public-Release History Remediation

This runbook defines the selected fresh-snapshot release procedure. Use a
restricted channel for every finding and evidence package. Never place secret
material, matches, fingerprints, sensitive line numbers, or unredacted scanner
output in tickets, logs, screenshots, or this repository.

## Release model

The public repository receives one root commit containing only the approved
tracked tree from `origin/main`. Earlier commits are not rewritten or
published. The old repository and all of its branches, tags, pull-request refs,
commits, and other Git objects remain in a restricted private archive.

Installed-build credential rotation is a separate operational rollout. It
requires provider smoke tests and an adoption plan for existing installations,
but it does not justify publishing any old Git history and is not a reason to
copy old objects into the public repository.

## Required release gates

1. Freeze changes and record the exact `origin/main` commit whose tracked tree
   is approved for publication. Confirm the local source is clean and that the
   selected commit is reachable from the tracked `origin/main` ref.
2. Create and verify an immutable restricted local or mirror backup of the old
   repository, preserving its access restrictions and audit record. Do not
   rename the canonical repository at this stage.
3. Export only the tracked tree from the selected `origin/main` commit into a
   new empty working directory. Do not clone, fetch, bundle, or copy `.git`, and
   do not use a source that contains untracked or ignored files.
4. Run the approved redacted scanner against the exact exported tree that will
   become the public root. Record the selected `origin/main` tree ID and require
   the new root commit to have the same tree ID. Retain only the zero-finding
   result and non-sensitive tree identity in the restricted evidence package.
5. Using the authenticated account `ozcan-durak`, create the temporary private
   repository `ozcan-durak/mobile-apps-public-staging`. Initialize a new
   repository in the scanned export, create exactly one root commit, and push
   only that commit to the staging repository. No parent commit, alternate
   object database, graft, replace ref, old remote, branch, tag, pull-request
   ref, reflog, copied packfile, or other old Git object from the archived
   repository may be present. Keep the owner as the only account with write
   access; do not add direct collaborators or teams before protections pass.
6. On the first push, run the Secret Scan workflow through its zero-base path.
   `scripts/security/scan-new-secrets.sh` must scan all history reachable from
   the new root and the archive of the tracked root tree. Require a zero-finding
   result before continuing.
7. Verify CI on the root commit and verify all settings supported while the
   personal staging repository is private, including its default branch,
   owner-only write access, Actions permissions, and available
   dependency/security settings. Record the intended branch protection,
   required-check, and temporary freeze-ruleset configuration. The current plan
   returns GitHub 403 for branch protection and rulesets on a private repository,
   and private vulnerability reporting is unavailable until public (API 404),
   so those are post-public gates rather than private-staging gates.
8. Make `ozcan-durak/mobile-apps-public-staging` public while it still has only
   its owner with write access. Immediately enable and verify normal `main`
   protection and required checks. Also create two active temporary freeze
   rulesets: one targeting all branch refs with `~ALL`, and one targeting all
   tag refs with `~ALL`. Each ruleset must restrict creation, update, and
   deletion to release-owner/admin bypass only. Enable and verify private
   vulnerability reporting, then verify that the root commit SHA and tree ID
   have not changed. Allow no other pushes, collaborators, teams, or
   announcements.
9. Before transfer, record Mapilio's current `default_repository_permission`,
   which is expected to be `write`, and begin a coordinated organization-wide
   write freeze. Organization admins are under the release freeze and must not
   use ruleset bypass except for the designated release owner performing this
   procedure. Immediately change `default_repository_permission` from `write`
   to `read`, verify the change, and only then transfer the already-protected
   repository into the organization as `mapilio/mobile-apps-public-staging`.
   Transferring while organization base write is enabled is unsafe because
   ruleset preservation across transfer is not guaranteed.
10. While the organization-wide write freeze remains active, verify or recreate
    both `~ALL` freeze rulesets and normal `main` protection and required checks.
    Re-verify private vulnerability reporting, access, and Actions settings.
    Re-enumerate every head and tag, require no unexpected ref or object, verify
    the root commit SHA and tree ID, and prove that all reachable history
    consists of the single root commit. Do not add direct collaborators or teams.
    Only after every transferred control and repository identity check passes,
    restore the recorded organization `default_repository_permission` and
    verify its restoration. Keep both repository freeze rulesets active.
11. Only after the protected transferred staging repository passes every gate,
    begin a frozen canonical cutover. Rename the old canonical repository once
    to `mobile-apps-private-archive`, preserving its private visibility and
    access restrictions, then rename `mapilio/mobile-apps-public-staging` to
    canonical `mapilio/mobile-apps`. Keep the all-branch and all-tag freeze
    rulesets active, and allow no pushes or announcements during cutover.
12. From a fresh unauthenticated clone of `mapilio/mobile-apps`, verify there is
    exactly one root commit, no unexpected refs or objects, and the root commit
    SHA and tree ID equal the values verified before transfer and cutover. The
    tree ID must also equal the recorded `origin/main` tree ID. Verify CI is
    healthy, the zero-base Secret Scan passed, and all protections, required
    checks, security settings, and private vulnerability reporting remain
    enabled before lifting the release freeze. Keep the temporary all-branch and
    all-tag freeze rulesets active through final verification; relax them only
    later under the normal contribution policy.

## Continuity warning

The fresh snapshot intentionally has no public continuity with the archived
repository: old commit hashes, pull requests, issues, branches, tags, and links
to them do not carry forward. Communicate this before the cutover. Every
collaborator and deployment checkout must make a fresh clone of the new
canonical repository. Never pull, merge, rebase, or push from an existing clone
of the archived repository.

## Operational rollout after publication

Smoke-test Google, Facebook, Apple, and OpenStreetMap against the deployed
backend-first authentication flow. Rotate superseded credentials through the
installed-build adoption plan and monitor provider sign-in, signed builds, CI,
and secret scanning. Keep values and provider evidence restricted. This work
protects deployed users; it does not alter or expand the public source snapshot.

## Abort and rollback criteria

Abort before cutover if the source is not the recorded tracked `origin/main`
tree; the exact-tree scan is nonzero; the new root tree ID differs from the
recorded `origin/main` tree ID; the restricted backup is unverified; staging
contains an old ref or object; the root commit has a parent; the first-push
zero-base Secret Scan fails; CI or private-supported settings, permissions, and
security controls cannot be verified; or sensitive scanner output is exposed.
The expected private-repository GitHub 403 for protection/rules configuration
and API 404 for private vulnerability reporting are not pre-cutover failures.
After personal staging becomes public, inability to enable or verify branch
protection, either `~ALL` freeze ruleset, required checks, private vulnerability
reporting, or an unchanged root SHA and tree ID is an immediate abort condition.
Do not transfer an unprotected repository into Mapilio. Failure to record,
change, verify, or restore the organization `default_repository_permission` is
an abort and rollback condition. Any failed control, unexpected ref or object,
multi-commit reachable history, or changed SHA/tree after transfer is also an
abort condition; quarantine staging while leaving the old canonical repository
unchanged. After canonical rename, any failed control, relaxed freeze ruleset,
changed SHA/tree, or unexpected ref or redirect is an immediate rollback
condition.

If a failure occurs before canonical rename, freeze staging, make it private if
it was public, and quarantine it under a distinct failed-staging name. Restore
and verify the recorded organization default permission if it was changed. If
the organization setting cannot be restored, keep the organization-wide freeze
in place, stop, and escalate through the restricted incident process. Preserve
both repositories and the restricted evidence; never delete either repository.

If a failure occurs after canonical rename, keep the freeze in place, make the
replacement canonical repository private, and rename or quarantine it under a
distinct failed-staging name. Rename `mobile-apps-private-archive` back to the
canonical `mapilio/mobile-apps` location. Before lifting the freeze, verify the
restored repository is private, points to the original commit and complete ref
set, and that GitHub redirects and collaborator remotes resolve to the restored
canonical repository. If any rollback step is impossible, stop and escalate
through the restricted incident process; do not permit pushes or announcements.
Never delete either repository, and never publish the archived history.

GitHub's [Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
guidance provides background for archive handling and release controls; this
fresh-snapshot procedure remains the controlling publication path.
