# Own build — `gpis-rebuild` becomes a repository

No steps and no hints this time. Build it your way, then compare.

Work in `~/projects/gpis-rebuild`.

## Requirements

1. It is a Git repository on branch `main`, with your real name and email set for this
   repository.
2. `.gitignore` ignores `.env`, `.env.*`, `node_modules/` and `notes/private/`. `.env.example`
   is **not** ignored.
3. What exists so far (`docs/commands.md`, `scripts/*.sh`) is committed in at least three
   commits, one topic each.
4. A branch `docs/git-notes` adds `docs/git.md` (your own ten-line Git guide) and is merged
   into `main` with a merge commit.
5. You made one conflict on purpose in `docs/commands.md` and resolved it. The history shows
   it.
6. `notes/unit-1-4.md` holds the graph (`git log --oneline --graph`), with one sentence per
   commit saying why it is a separate commit.

## Who checks it

This build is **self-reviewed**. Go through the six requirements one by one and run a
command that proves each. For requirement 2, `git check-ignore -v` is your friend.

## Then compare with GPIS

GPIS commits `.env.example`, which holds variable names and no values, and never commits
`.env.local`. Write in `notes/unit-1-4.md`: why is one committed and the other not? What would
a new developer lose if `.env.example` were missing?
