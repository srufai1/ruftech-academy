# Lab — Project 2.5: Repair, do not rewrite

**Level:** guided. **Checker:** `m2-p5`. **Time:** about 285 minutes.

The admissions office uses a small helper module. Three reports came in. Fix all three — with
a failing test first, the smallest change, and nothing else touched.

## Start

```bash
npx academy init m2-p5
```

This creates the repository `~/academy-labs/m2-p5/admissions-helper`, with a tag called
`start` on its last commit. (It also creates `~/academy-labs/m2-p5/class-codes` for the
debugging lab; leave it for now.)

```bash
cd ~/academy-labs/m2-p5/admissions-helper
```

Set your name and email for this repository. There is nothing to install: run `npm test`.

What is in the repository:

| Name | What it is |
| :--- | :--- |
| `src/admission-number.ts` | `nextAdmissionNumber(existing, year)` — D-48 |
| `src/full-name.ts` | `splitFullName(fullName)` — D-46 |
| `src/house.ts` | `assignHouse(counts)` — D-70 |
| `tests/` | Nine tests. All pass. None covers the three reports |
| `REPORTS.md` | The three reports, in the users' words, with their rules |

## What "done" means

| # | Requirement |
| :--- | :--- |
| 1 | All three reports are fixed |
| 2 | Everything that was right stays right |
| 3 | For each bug there is a commit whose message starts `Test: `, and a later one that starts `Fix: ` (three of each) |
| 4 | The change to `src/` since `start` is at most 12 lines (added plus removed) |
| 5 | No file in `src/` was renamed, added or deleted |
| 6 | `npm test` passes, and the history holds no secret |

## Steps (guided)

1. Read `REPORTS.md`, then the tests, then the code. Write one sentence per function in a
   new file `NOTES.md`.
2. Report A: write the failing test. Run it; read the failure. Commit `Test: …`.
3. Find the line. Fix it. Run all the tests. `git diff --stat`. Commit `Fix: …`.
4. The same for report B.
5. The same for report C.
6. Check the total: `git diff --stat start -- src`.

## Hints

- **a.** For A, ask what `existing` contains for other years.
- **b.** For B, print the pieces after the split with `JSON.stringify`.
- **c.** For C, try three Houses with equal counts, and see which is returned.

## Check your work

```bash
npx academy check m2-p5
```

`npx academy check m2-p5 --at=start` runs the same check on the first state, so you can see
what it looked like before your work.

## Compare with GPIS

GPIS assigns the House in the database, not in TypeScript. In your read-only copy, open
`supabase/migrations/20260912130000_add_student_houses.sql` and find `order by`. How does it
break a tie? Write one sentence in `NOTES.md`.
