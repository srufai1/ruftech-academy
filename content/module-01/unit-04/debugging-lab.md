# Debugging lab — My two commits vanished

**Rule for every debugging lab:** find the cause before you change anything. GPIS works by
the same rule: OBSERVE → ISOLATE → TEST → PROVE → DOCUMENT → MOVE ON.

## The report

A colleague says: "I made two commits this morning. `git log` does not show them." Later she
adds: "And `git add notes/meeting.md` does nothing useful. Git says the path is ignored."

## Start

The lab from project 1.4 built this repository too. If you have not run it yet:

```bash
npx academy init m1-p4
```

```bash
cd ~/academy-labs/m1-p4/timetable
```

Set your name and email for this repository, as in the lab. Then do what she did:

```bash
git log --oneline
```

## Your work

Do not fix anything yet. Fill in `diagnosis.md` in that folder:

| Heading | What to write |
| :--- | :--- |
| `## Observe` | The exact command and its output. Which commits are missing? |
| `## Possible causes` | At least three, for example: the commits are on another branch; they were never made; they were made on a detached HEAD |
| `## Tests` | One command per cause, with its output: `git branch -a`; `git reflog`; `git status` |
| `## Cause` | The cause the evidence supports |
| `## Fix` | The smallest change, and the command that shows it now works |

There are **two** faults. The second is the ignored file. For it, `git check-ignore -v
notes/meeting.md` names the file and the line responsible. Observe it as a new problem.

Do not use `git add -f`, `git reset --hard` or `git branch -D`. Forcing hides the cause.

## Fixed state

- `git log --oneline main` shows "Add the Friday assembly" and "Move sports to Wednesday".
- `git ls-files` lists `notes/meeting.md`: it is tracked.
- The `.gitignore` change is committed.
- Nothing was force-added, reset or deleted.

## Who checks it

This lab is **self-reviewed**. The checker does not mark it yet. Compare your `diagnosis.md`
with the five headings above, and ask yourself: did I write the cause **before** I changed
anything?
