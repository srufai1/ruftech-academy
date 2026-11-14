# Own build — Publish and one helper

No steps and no hints this time. Build it your way, then compare.

Work in `~/projects/gpis-rebuild`.

## Requirements

1. A **private** GitHub repository `gpis-rebuild` exists, and `main` is pushed: `git status`
   says "up to date with 'origin/main'".
2. **Before** the push you ran `git log -p | grep -n "sb_secret\|PASSWORD\|TOKEN"` and wrote
   the result in `notes/unit-1-6.md`.
3. `scripts/new-note.sh UNIT` (for example `2-1`) creates `notes/unit-2-1.md` with three
   headings: `## What I built`, `## What surprised me`, `## Compare with GPIS`.
4. It refuses to overwrite a note that exists (message on standard error, exit 1), and
   refuses a unit that is not in the form `N-N` (exit 2).
5. `verify.sh` also runs `bash -n` on every file in `scripts/*.sh` (a syntax check).
6. The README's "Folder layout" is up to date. One commit per requirement.

## Who checks it

This build is **self-reviewed**. Go through the six requirements one by one and run a
command that proves each. `npx academy check m1-p6` must still pass afterwards.

## Then compare with GPIS

GPIS's `scripts/` folder has `check-no-secret-key.sh`, which CI runs on every change. Read
it in your read-only copy. Write in `notes/unit-1-6.md`: what does it search for, and why is
running it in CI safer than your one search by hand in requirement 2?
