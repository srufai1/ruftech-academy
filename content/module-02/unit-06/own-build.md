# Own build — A year in memberships

No steps and no hints this time. Build it your way, then compare.

Work in `~/projects/gpis-rebuild`.

## Requirements

1. `src/lib/history.ts` exports `classHistory(memberships, classes, years, studentId)`: one
   line per membership, oldest first: `{ yearName, className, from, to }` (`to` is `null`
   while open).
2. `gaps(memberships, studentId)`: the periods between memberships (an absence, D-23), each
   `{ from, to }`.
3. `repeatedYears(memberships, studentId)`: the classes the student had in two consecutive
   academic years. Repeating a year is two memberships; there is no flag.
4. A fixture student who was withdrawn for one term, returned, and repeated a year. Tests
   first.
5. `notes/unit-2-6.md`: draw this student's timeline in text.

## Who checks it

This build is **self-reviewed**. Go through the five requirements and run a command that
proves each. `npm run typecheck`, `npm test` and `./scripts/verify.sh` must pass, and
`npx academy check m2-p6` still passes.

## Then compare with GPIS

GPIS prevents overlapping memberships in the database (D-22), not in code. Write in
`notes/unit-2-6.md`: what can a database constraint do that your `overlaps` function cannot?
Module 4 builds it.
