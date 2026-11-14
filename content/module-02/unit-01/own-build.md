# Own build — Medals for a quiz night

No steps and no hints this time. Build it your way, then compare.

This is **not** a GPIS rule. The bands are yours to design. Work in
`~/projects/gpis-rebuild`.

## Requirements

1. `src/lib/quiz-night.mjs` exports `medalFor(points, maxPoints)`. It has at least four
   bands, defined as percentages in one table.
2. `maxPoints` must be a whole number above 0, and `points` a number from 0 to `maxPoints`.
   Anything else is refused, with the right kind of error.
3. Every band edge is tested on both sides. The tests were written first: the history shows a
   test commit before each code commit.
4. One test proves that the function reads the table: it changes a number in a copy of the
   table and gets a different result. (Hint for the design, not the code: the function may
   take the table as an optional third parameter.)
5. `notes/unit-2-1.md` (made with `scripts/new-note.sh 2-1`): the rule in words, and one
   boundary you got wrong at first.

## Who checks it

This build is **self-reviewed**. Go through the five requirements and run a command that
proves each. `npm test` and `./scripts/verify.sh` must pass.

## Then compare with GPIS

GPIS checks remarks from the top band with `>=`, like you. Write in `notes/unit-2-1.md`: is
your quiz-night table "highest first" too? What would break if someone sorted it the other
way?
