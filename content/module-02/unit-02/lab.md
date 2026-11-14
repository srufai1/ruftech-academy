# Lab — Project 2.2: Class ranking

**Level:** guided. **Checker:** `m2-p2`. **Time:** about 300 minutes.

The report card prints each pupil's position in the class. Write the functions that give it,
by the school's rules:

- **D-02:** standard competition ranking on total score. 90, 90, 80 → 1, 1, 3. 75, 70, 70,
  65 → 1, 2, 2, 4. Not dense ranking.
- **D-03:** one class at a time.
- **Q-07:** a pupil with missing subject scores still gets a position; a missing subject adds
  nothing to the total; the total is rounded to two decimals.
- **D-04:** only active pupils are ranked.

## Start

```bash
cd ~/projects/gpis-rebuild
```

## What "done" means

`src/lib/ranking.mjs` exports four functions:

| # | Requirement |
| :--- | :--- |
| 1 | `competitionRanks(totals)` takes an array of numbers and returns their positions **in the same order**. 90, 90, 80 → 1, 1, 3. `[]` → `[]`. One total → `[1]` |
| 2 | It does not change the array it was given |
| 3 | `subjectsTotal(subjects)` adds an array of numbers and `null`s. `null` adds nothing. The result is rounded to two decimals. All `null`, or `[]`, gives 0 |
| 4 | `ordinal(n)` gives `"1st"`, `"2nd"`, `"3rd"`, `"4th"`, `"11th"`, `"12th"`, `"13th"`, `"21st"`, `"22nd"`, `"101st"`, `"111th"`. It refuses anything but a whole number of 1 or more |
| 5 | `rankClass(students)` takes `[{ id, status, subjects }]` and returns `[{ id, total, position, ordinal }]` for the students whose `status` is `"active"`, in the input order |
| 6 | A student with a missing subject is ranked on the total of the others (Q-07) |
| 7 | Students who are not active are left out, and do not move anyone's position (D-04) |
| 8 | `tests/ranking.test.mjs` has at least 15 tests of your own, one with `D-04` in its name. `npm test` and lint pass |

## Steps (guided)

1. Tests for `competitionRanks` from the two D-02 examples.
2. The function: for each total, count the totals strictly higher. Start simple.
3. Tests: empty, one, all equal, already sorted, reverse sorted.
4. Prove the input is not changed: pass `Object.freeze([…])` and compare after the call.
5. `subjectsTotal`, tests first, with `[0.1, 0.2]` and with `null`.
6. `ordinal`: watch 11, 12 and 13.
7. `rankClass` joins them.
8. The D-04 test: a withdrawn pupil with the highest total, and the best active pupil still
   1st.
9. Commit after each function.

## Hints

- **a.** "How many totals are strictly higher than mine?" plus one is my position.
- **b.** For `ordinal`, look at the last **two** digits before the last digit.
- **c.** `filter` first, then rank what remains.

## Check your work

```bash
npx academy check m2-p2
```

## Compare with GPIS

Open `src/lib/assessments/rank.ts` in your read-only copy. GPIS sorts once and walks the
list. Write one sentence in your notes: how does its way of finding a tie differ from
counting higher totals?
