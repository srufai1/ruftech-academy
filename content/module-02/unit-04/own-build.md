# Own build — Age on a date

No steps and no hints this time. Build it your way, then compare.

Work in `~/projects/gpis-rebuild`.

## Requirements

1. `src/lib/age.ts` exports `ageOn(dateOfBirth, onDate)`: completed years. Both are
   `YYYY-MM-DD`.
2. A pupil born on 29 February has a birthday on 1 March in a year without 29 February.
3. `onDate` before `dateOfBirth`, or a date that does not exist, is refused.
4. `ageToday(dateOfBirth, now = new Date())` uses `schoolToday`.
5. `src/lib/initials.ts` exports `initials("Godfred Kofi Asante")` → `"GKA"`. Extra spaces and
   full stops do not matter; an empty name is refused.
6. Tests first. `notes/unit-2-4.md` lists the three dates you found hardest, and why.

## Who checks it

This build is **self-reviewed**. Go through the six requirements and run a command that
proves each. `npm run typecheck`, `npm test` and `./scripts/verify.sh` must pass.

## Then compare with GPIS

GPIS stores a date of birth as a date, not a moment. Write in `notes/unit-2-4.md`: what would
go wrong for a pupil born at 00:30 if it were stored as a moment, and read by a server in New
York?
