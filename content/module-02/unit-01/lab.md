# Lab — Project 2.1: Grading scale

**Level:** guided. **Checker:** `m2-p1`. **Time:** about 285 minutes.

Every GPIS screen and document that shows a remark uses one scale, D-01. Write the function
that gives it, test first, in your own project.

**D-01, Creche to JHS 2** (JHS 3 does not use this scale):

| Total | Remark |
| :--- | :--- |
| 80–100 | Highest |
| 70–79 | Higher |
| 65–69 | High |
| 60–64 | High Average |
| 55–59 | Average |
| 50–54 | Low Average |
| 45–49 | Low |
| 40–44 | Lower |
| 0–39 | Lowest |

## Start

This is a **repo project**. Work in your own project:

```bash
cd ~/projects/gpis-rebuild
```

```bash
mkdir -p src/lib tests
```

## What "done" means

| # | Requirement |
| :--- | :--- |
| 1 | `src/lib/grading.mjs` exports `remarkFor(total)` and `REMARK_BANDS` |
| 2 | `remarkFor` returns the D-01 remark for every total from 0 to 100, whole or with decimals. 79.5 is "Higher": a band starts **at** its lower number |
| 3 | A total below 0, above 100, `NaN` or infinite is refused with `RangeError` |
| 4 | A value that is not a number (`"80"`, `null`, `undefined`, `true`) is refused with `TypeError` |
| 5 | `REMARK_BANDS` is an array of nine `{ low, label }` objects, highest band first. `remarkFor` reads it, so the nine words are typed once |
| 6 | `tests/grading.test.mjs` is yours: at least 18 tests, and `npm test` passes |
| 7 | `npm run lint` passes, and you made at least 4 new commits |

## Steps (guided)

1. Add the test script: `npm pkg set scripts.test="node --test"`.
2. Write three tests from the table: 100, 80 and 79. Run `npm test`: red.
3. Write `remarkFor` for those three. Green.
4. One band at a time: two tests (both sides of its lower edge), then the code. Commit after
   each group of bands.
5. The refusals: tests first, then the checks.
6. Move the nine bands into `REMARK_BANDS`, and make `remarkFor` loop over it. All tests stay
   green: that is how you know the change is safe.
7. Add `npm test --silent` to `scripts/verify.sh`, after lint.
8. Commit.

## Hints

- **a.** Work from the top band down.
- **b.** `Number.isFinite` is false for `NaN`, `Infinity` and for text.
- **c.** To check "typed once": `grep -c "High Average" src/lib/grading.mjs` should print `1`.

## Check your work

Inside `~/projects/gpis-rebuild`:

```bash
npx academy check m2-p1
```

The checker runs its own tests against your `remarkFor`, for all 101 whole totals and more. It
never reads your tests to grade them; it only counts them.

## Compare with GPIS

Open `src/lib/assessments/remark.ts` in your read-only copy. Find `remarkFromTotal`. What
does it do with a total of 140? Yours refuses it. Write one sentence in your notes about the
difference; the review asks about it.
