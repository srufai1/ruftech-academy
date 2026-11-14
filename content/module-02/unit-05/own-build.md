# Own build — A second pair of eyes on your own code

No steps and no hints this time. Repair your own work, then compare.

Work in `~/projects/gpis-rebuild`.

## Requirements

1. Choose one of your own functions from units 2.1 to 2.4. Ask: "what input did I never
   test?" Find one that gives a wrong or surprising answer — there usually is one. If you
   cannot find one in 45 minutes, say so, and choose `ordinal` with numbers above 1,000,000,
   or `matchesName` with accented letters.
2. Write the failing test. Commit `Test: …`.
3. Fix it with the smallest change. Commit `Fix: …`.
4. `notes/unit-2-5.md`: the report in a user's words, the cause in one sentence, and the diff
   size.
5. Nothing else in the file changes.

## Who checks it

This build is **self-reviewed**. Show each requirement with a command: `git log --oneline`,
`git show --stat`, `npm test`. The earlier checks (`m2-p1` to `m2-p4`) must still pass.

## Then compare with GPIS

In your read-only copy run `git log --oneline --grep="Fix" | head`. Open one commit with
`git show --stat`. Write in `notes/unit-2-5.md`: how many lines of source did it change, and
did a test change in the same commit?
