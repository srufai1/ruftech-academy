# Lab — Project 1.6: Project home

**Level:** guided. **Checker:** `m1-p6`. **Time:** about 285 minutes.

From the next module on, every unit adds code to `~/projects/gpis-rebuild`. Give it a proper
home first: a README, your rules, lint, one command that checks everything, and the school's
details written in one place.

## Start

This is a **repo project**: there is no lab folder. You work in your own project.

```bash
cd ~/projects/gpis-rebuild
```

```bash
git status
```

If Git says this is not a repository, run `git init -b main` first. If you are on another
branch, `git switch main`.

## What "done" means

| # | Requirement |
| :--- | :--- |
| 1 | A Git repository, on branch `main` |
| 2 | `README.md` with `## What this is`, `## How to run`, `## Folder layout`, `## Rules`; at least 25 words each |
| 3 | `RULES.md` with `## Boundaries`, `## Before I commit`, `## When something looks wrong`; at least 30 words each. "When something looks wrong" names the six GPIS steps, in order, on one line |
| 4 | `package.json`: `private` is true, `type` is `module`, and there are scripts `lint` and `verify` |
| 5 | `eslint.config.mjs` exists and `npm run lint` passes |
| 6 | `src/config/school.mjs` exports `school` with `name: "Great Pakyiman International School"` and `shortName: "GPIS"` |
| 7 | `scripts/school-info.mjs` prints `Great Pakyiman International School (GPIS)` using that module. The name is typed in no other file under `src/` or `scripts/` |
| 8 | `scripts/verify.sh` runs lint and `school-info`, prints `verify ok` as its last line and exits 0. It exits with another code when lint fails |
| 9 | `.gitignore` covers `node_modules/`, `.env` and `.env.*`; `.env.example` exists and is committed; `node_modules` and `.env` are not tracked |
| 10 | At least 8 commits, each message 15 characters or more, and no secret |

## Steps (guided)

1. `git status`. Make sure you are on `main`.
2. Write `.gitignore`. Commit it.
3. `npm init -y`, then edit `package.json`. Commit.
4. Write the config module and `scripts/school-info.mjs`. Commit.
5. Install ESLint and write `eslint.config.mjs`, as in the guided example. If lint reports
   problems in your `.mjs` files, fix the code. Commit.
6. Write `scripts/verify.sh`. Test the failing case by hand: break lint on purpose, run it,
   check `echo $?`, then repair. Commit.
7. Write `.env.example`. Commit.
8. Write `RULES.md`: the rules you will follow, in your own words. Commit.
9. Write `README.md`. Then follow it in a fresh clone under `~/academy-labs/scratch/`. Correct
   it. Commit.
10. Run the checker.

## Hints

- **a.** GPIS's `AGENTS.md` has a section "Engineering discipline". Your rules file may quote
  its six steps, if you name the source.
- **b.** `npm pkg set type=module` edits `package.json` for you.
- **c.** To prove requirement 7, search: `grep -rn "Pakyiman" src scripts`.

## Check your work

Inside `~/projects/gpis-rebuild`:

```bash
npx academy check m1-p6
```

The checker cannot break your lint to see `verify.sh` fail. That part (requirement 8, second
sentence) you prove yourself, in step 6.

Fix what fails and run it again. Every run is recorded; a failed run costs nothing.

## Compare with GPIS

Open `README.md` and `AGENTS.md` in your read-only copy of GPIS. Which sections of your
README does GPIS's README also have? Which does it have that yours does not? Write two
sentences in `notes/unit-1-6.md`.
