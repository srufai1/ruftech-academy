# Git: a history you can trust

This lesson has two parts. Part A is about making commits. Part B is about joining work and
repairing mistakes.

## Part A

## A1. What Git stores

Git keeps a **history** of your project. Each entry is a **commit**: a full snapshot of the
files, the commit it came after (its **parent**), an author, a date and a message. A commit
has an ID, a long number such as `b32d91e…`. The first seven characters are usually enough.

Git stores snapshots, not lists of changes. When you ask "what changed?", Git compares two
snapshots for you.

```bash
git log --oneline --graph --all
```

draws the history: one line per commit, newest first.

## A2. Three places

| Place | What it holds | Command that shows it |
| :--- | :--- | :--- |
| **Working tree** | The files you edit | `git status`, `git diff` |
| **Staging area** | What the next commit will contain | `git diff --staged` |
| **Repository** | The commits | `git log` |

`git add file` copies a change from the working tree into the staging area. `git commit`
makes a commit from the staging area. `git add -p` lets you choose part of a file.

Read `git status` before every `git add`. It tells you what would go in.

## A3. Good commits

One commit, one topic. If the message needs "and", it may be two commits.

The message says **what** changed and **why**, in the present tense, as if finishing the
sentence "This commit will …":

- Good: `Reject marks above the stored maximum`
- Bad: `fix`, `update`, `wip`, `changes` — they tell the next reader nothing.

## A4. Branches are names

A **branch** is a name that points to one commit. It is not a copy of the files. When you
commit on a branch, the name moves forward to the new commit.

**HEAD** means "where you are now". Usually HEAD points to a branch.

- `git switch -c name` makes a branch here and moves to it.
- `git switch main` moves back.
- `git branch` lists the branches.

If HEAD points to a commit and not to a branch, Git calls it a **detached HEAD**. Commits you
make there have no branch name. Git warns you; read the warning.

## A5. Ignoring files

`.gitignore` lists files Git must not offer to add: `.env`, `node_modules/`, build output.

"Ignored" only affects files Git does not track yet. A file that was already committed stays
in the history, even if you add it to `.gitignore` later.

Stop here. Do steps 1–4 of the guided example. Then read Part B.

## Part B

## B1. Merging

`git merge other` brings the commits of `other` into the branch you are on.

- If your branch has not moved since `other` started, Git moves your name forward. This is a
  **fast-forward**; no new commit.
- If both moved, Git makes a **merge commit** with two parents.
- `git merge --no-ff other` always makes a merge commit, so the history shows that a branch
  was joined.

```text
*   e5 Merge branch 'fix/term-dates'      ← two parents
|\
| * e4 Correct the Term 2 closing date    ← fix/term-dates
| * e3 Add the mid-term break to Term 1
* | e2 Correct the Term 1 opening date    ← main
|/
* e1 Add the class list
      deleted branch: its commit still exists, and git reflog still lists it
```

## B2. Conflicts

A **conflict** happens when both branches changed the same lines. Git cannot choose, so it
writes both versions into the file:

```text
<<<<<<< HEAD
Tuesday: football          ← your branch (where HEAD is)
=======
Tuesday: drama             ← the branch you are merging
>>>>>>> tuesday-drama
```

Read **both** sides. Write the text that is right, which may take parts of each. Delete the
three marker lines. Then `git add` the file and `git commit`. `git diff --check` finds markers
you forgot. `git merge --abort` goes back to before the merge.

## B3. Nothing is lost quickly

`git reflog` lists every place HEAD has been, with the commit ID. A commit that no branch
points to is not shown by `git log --all`, but it still exists for weeks, and the reflog
knows its ID.

To bring it back: `git branch rescue <id>`, then merge `rescue`. Or copy that one commit onto
your branch with `git cherry-pick <id>`.

The reflog cannot bring back work that was **never committed**.

## B4. Rewriting history

| Command | What it destroys |
| :--- | :--- |
| `git commit --amend` | Replaces the last commit with a new one |
| `git reset --hard` | Throws away uncommitted changes in the working tree, for good |
| `git push --force` | Replaces the history other people already have |

The rule: **never rewrite history that others already have.** Add a new commit that corrects
the old one instead.

## B5. In GPIS

GPIS commits are small and say what changed. Its security rule 7 says secret files such as
`.env.local` are never committed, and its CI searches every change for secret keys. If a real
key is ever pushed, deleting the file in a new commit is not enough: the key is in the
history, so the key must be **changed** (rotated) first.

## Common mistakes

1. `git add .` without reading `git status` → a secret or a huge folder is committed → read
   `status` first.
2. Choosing one side for the whole file in a conflict → one person's work is lost → read both
   sides line by line.
3. Leaving conflict markers in the file → the file is committed broken → `git diff --check`
   before `add`.
4. Deleting a committed secret in a new commit → it is still in history → rotate the key.
5. `reset --hard` to "start again" → uncommitted work is gone for good → commit first.

## Words to remember

commit · parent · working tree · staging area · branch · HEAD · detached HEAD · merge ·
fast-forward · merge commit · conflict · reflog · `.gitignore` · rotate a key
