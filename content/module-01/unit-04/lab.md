# Lab — Project 1.4: Git rescue

**Level:** guided. **Checker:** `m1-p4`. **Time:** about 270 minutes.

Two colleagues edited the term notes. One branch does not merge cleanly. A branch with
finished work was deleted by mistake. And a file with a password is lying in the folder.
Rescue the repository without rewriting anything that is already in it.

## Start

```bash
npx academy init m1-p4
```

This creates the repository `~/academy-labs/m1-p4/school-notes`. Work inside it. (It also
creates `~/academy-labs/m1-p4/timetable` for the debugging lab; leave it for now.)

```bash
cd ~/academy-labs/m1-p4/school-notes
```

Tell Git who you are, for this repository only. Use your real name:

```bash
git config user.name "Your Name"
```

```bash
git config user.email "you@example.com"
```

To start again at any time, run the `init` command again with `--reset`.

What is in the repository:

| Name | What it is |
| :--- | :--- |
| `main` | Four commits: the term notes, the class list, a corrected Term 1 date, the holidays |
| `fix/term-dates` | A branch with two commits that change the term dates |
| `.env` | A file with a token. It is not committed. Keep it that way |
| `TASK.md` | What the head teacher wants. Read it first |
| `.vscode/` | Settings for the editor. You may ignore it |

## What "done" means

| # | Requirement |
| :--- | :--- |
| 1 | `fix/term-dates` is merged into `main` with a merge commit |
| 2 | `terms.md` line 1 reads `Term 1: 14 September 2026 to 18 December 2026 (mid-term break 26 to 30 October)`; line 2 has the corrected Term 2 date; no conflict markers anywhere |
| 3 | `houses.md` is on `main`, with the content of the lost commit |
| 4 | All six seeded commits are still in the history of `main` (nothing rewritten) |
| 5 | `.env` is ignored and was never committed |
| 6 | `.gitignore` is committed |
| 7 | Your own commits have messages of 15 characters or more that say what changed |
| 8 | Every change is committed, and you are on `main` |

## Steps (guided)

1. Look first: `git status`, then `git log --oneline --graph --all`. Read `TASK.md`.
2. Deal with `.env` first. Write a `.gitignore`, check it with `git status`, and commit it.
3. `git merge fix/term-dates`. Read the conflict.
4. Write line 1 as `TASK.md` says. Look at line 2: which side has the corrected Term 2 date?
   Search for markers with `git diff --check`. Then `git add` and `git commit --no-edit`.
5. `git reflog`. Find "Add the four houses" and its ID.
6. Make a branch at that commit and merge it into `main` (or `git cherry-pick` the commit).
7. `git log --oneline --graph` — can you explain every line?
8. `git status` shows nothing to commit.

## Hints

- **a.** `git log --all` does not show commits that no branch points to. `git reflog` does.
- **b.** In a conflict, the part above `=======` is the branch you are on (HEAD).
- **c.** `git diff --check` finds leftover markers before you commit them.

Do not use `git reset --hard`, `git commit --amend` or `git rebase` in this lab. The check
looks for every commit that was there at the start.

## Check your work

```bash
npx academy check m1-p4
```

Fix what fails and run it again. Every run is recorded; a failed run costs nothing.

## Compare with GPIS

In your read-only copy of GPIS, run `git log --oneline | head -30`. Pick three messages. What
do they have in common? Is any of them like `fix` or `update`? Write your answer in a new
file `notes.md` outside this repository, for example in `~/projects/gpis-rebuild/notes/`.
