# Lab — Project 2.3: Score rules

**Level:** guided. **Checker:** `m2-p3`. **Time:** about 345 minutes.

Teachers type marks into boxes. Some boxes are left empty; some say `ABS`; some hold a typing
mistake. Move your project to TypeScript, then write the rules that turn typed text into a
checked mark and work out a total — only when every part is there.

**The rules:**

- **D-162** (Creche to JHS 2): Individual Test, Class Test, Group Work and Project Work, each
  out of 15; the Examination out of 100. CA raw (out of 60) is scaled to 50; the exam is
  scaled to 50; Final = CA scaled + exam scaled, out of 100. Zero, blank and `ABS` are three
  different things; blank and `ABS` never become 0; a total exists only when every part is a
  number. Marks have at most two decimal places.
- **D-10:** a missing score prints blank, never 0.
- **D-171:** JHS Integrated Science is marked out of 140. The maximum is data (D-27).

## Start

```bash
cd ~/projects/gpis-rebuild
```

```bash
npm install --save-dev typescript @types/node
```

## What "done" means

| # | Requirement |
| :--- | :--- |
| 1 | TypeScript is set up with the `tsconfig.json` of the guided example; `npm run typecheck` passes. `grading` and `ranking` are now `.ts` files with typed parameters and results, and the checks `m2-p1` and `m2-p2` still pass |
| 2 | `src/lib/marks.ts` exports these types: `RawMark = number \| "ABS" \| null`; `MarkResult` (`{ ok: true; value: RawMark } \| { ok: false; error: string }`); `Marks` (`individual`, `classTest`, `group`, `project`, `exam`, each a `RawMark`); `Calculated` (`caRaw`, `caScaled`, `examScaled`, `total`: `number \| null`; `complete`, `hasAbsence`: `boolean`) |
| 3 | `parseMark(input: unknown, max: number): MarkResult`. `null`, `undefined`, `""`, `"   "` → `null`. `"ABS"`, `"abs"`, `" Abs "` → `"ABS"`. Numbers, or text of digits with at most two decimals, from 0 to `max` → the number. `0` and `"0"` → 0 |
| 4 | Refused with `ok: false` and an error sentence (which names the maximum when the mark is too high): above `max`, negative, three decimals, `"1e2"`, `"0x10"`, `"12."`, `".5"`, `"12abc"`, `NaN`, `Infinity`, `true`, `[]`, `{}` |
| 5 | `parseMark` never throws |
| 6 | `calculateTotal(marks: Marks, examMax = 100): Calculated`. Each of the four parts has a maximum of 15; the exam has `examMax`. CA scaled = CA raw / 60 × 50; exam scaled = exam / `examMax` × 50; every number rounded to two decimals; total = CA scaled + exam scaled |
| 7 | `total` is `null` unless all five parts are numbers. `complete` is true when no part is `null`. `hasAbsence` is true when any part is `"ABS"`. A blank or `ABS` never counts as 0 |
| 8 | `calculateTotal` throws `RangeError` if a number is outside its maximum: it trusts `parseMark`, but checks |
| 9 | Your own tests in `tests/marks.test.ts`, at least 25. No `any` in `src/` |

## Steps (guided)

1. Write `tsconfig.json`. Add `"typecheck": "tsc --noEmit"` to `package.json`, and
   `npm run --silent typecheck` to `scripts/verify.sh`.
2. Rename `grading.mjs` to `grading.ts` with `git mv`. Add types. Rename its test file to
   `.ts` and fix the import. Run `npx academy check m2-p1`. Then the same for `ranking`.
3. Write the types of requirement 2.
4. `parseMark`: blank first, then `ABS`, then the pattern, then the range — each test first.
5. The refusal list of requirement 4.
6. `calculateTotal` with the worked example: 12, 13.5, 14, 10 and exam 68 give CA raw 49.5,
   CA scaled 41.25, exam scaled 34, total 75.25.
7. A blank part, then an `ABS` part.
8. `examMax` 140.
9. Search `src/` for `any`. Commit after each step.

## Hints

- **a.** A pattern that must match the **whole** text starts with `^` and ends with `$`.
- **b.** Decide "is every part a number?" once, with `every` or a `filter`.
- **c.** `tsc` errors name a file and a line. Read the first one only, fix it, run again.

## Check your work

```bash
npx academy check m2-p3
```

Then run `npx academy check m2-p1` and `npx academy check m2-p2` again: they must still pass.

## Compare with GPIS

Open `src/lib/assessments/raw-marks.ts` in your read-only copy. Find `parseRawMark`. List
two things it checks that your `parseMark` also checks, and one thing it returns that yours
does not.
