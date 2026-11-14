# Own build — A league table

No steps and no hints this time. Build it your way, then compare.

Work in `~/projects/gpis-rebuild`.

## Requirements

1. `src/lib/league.mjs` exports `leagueTable(results)`. `results` is a list of
   `{ home, away, homeGoals, awayGoals }`. The output has one row per team: played, won,
   drawn, lost, goals for, goals against, points (3 for a win, 1 for a draw, 0 for a loss) and
   position.
2. Order: points, then goal difference, then goals for, all biggest first. Teams equal on all
   three **share** a position (competition ranking) and are listed A to Z.
3. The input is not changed. A team may not play itself (refused). Goals are whole numbers of
   0 or more.
4. Tests first, with at least one three-way tie.
5. `notes/unit-2-2.md`: which of your `ranking.mjs` functions you reused, and what you had to
   change.

## Who checks it

This build is **self-reviewed**. Go through the five requirements and run a command that
proves each. `npm test` and `./scripts/verify.sh` must pass.

## Then compare with GPIS

GPIS ranks on one number, the total. Your table ranks on three. Write in
`notes/unit-2-2.md`: if the school ever decided "equal totals are separated by the
Mathematics score", which part of your league code would you copy, and which GPIS decision
would have to change first?
