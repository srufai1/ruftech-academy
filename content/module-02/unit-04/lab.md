# Lab — Project 2.4: School dates and names

**Level:** guided. **Checker:** `m2-p4`. **Time:** about 330 minutes.

The dashboard needs "today at the school" and the current term, wherever the server is. The
student search must find a name in any word order. Write both parts.

**The rules:**

- The school's dates are calendar dates in `Africa/Accra`, written `YYYY-MM-DD`. Day
  arithmetic is on whole calendar days.
- **D-247:** a name search matches when every typed word appears in the first, middle or last
  name, in any order; full stops are ignored.

**Sample terms** for your tests (made up for this lab; **not** the school's real calendar):
Term 1 2026-09-14 to 2026-12-18; Term 2 2027-01-11 to 2027-04-01; Term 3 2027-04-26 to
2027-07-29.

## Start

```bash
cd ~/projects/gpis-rebuild
```

## What "done" means

| # | Requirement |
| :--- | :--- |
| 1 | `src/lib/school-date.ts` exports `SCHOOL_TIME_ZONE = "Africa/Accra"` and `schoolToday(now: Date = new Date()): string` (`YYYY-MM-DD`). It is correct whatever the computer's time zone is |
| 2 | `isIsoCalendarDate(text)` is true only for a real date written `YYYY-MM-DD` |
| 3 | `addDays(iso, days)` and `daysBetween(from, to)` work on whole calendar days. `daysBetween` gives `null` if either text is not a real date |
| 4 | `termFor(date, terms)`: `terms` is `[{ name, startsOn, endsOn }]`. It returns the term whose period includes `date` (both ends included), or `null`. It throws `RangeError` if `date` is not a real date, or if two terms overlap. It does not change `terms` |
| 5 | `src/lib/name-search.ts` exports `nameSearchWords(text): string[]` (lower-case words, full stops removed, no empty words) and `matchesName(fullName, query): boolean` |
| 6 | `matchesName`: every word of the query appears somewhere in the name (D-247). Case does not matter. An empty query matches every name |
| 7 | No function reads the clock, except through the `now` default |
| 8 | Your own tests (20 or more); typecheck and lint pass |

## Steps (guided)

1. `schoolToday`, tested with three fixed moments.
2. Run your tests with two other zones: `TZ=Pacific/Kiritimati npm test` and
   `TZ=America/Los_Angeles npm test`.
3. `isIsoCalendarDate`.
4. `addDays` and `daysBetween`, across a month end, a year end and 29 February 2028.
5. `termFor`: a day inside, the first day, the last day, a holiday between terms, overlapping
   terms refused.
6. `nameSearchWords`.
7. `matchesName`.
8. Search your files: `grep -rn "new Date()\|Date.now()" src/lib`. Only the `now` default may
   remain. Commit after each step.

## Hints

- **a.** `en-CA` formats a date as `YYYY-MM-DD`.
- **b.** Build a date with `Date.UTC`, then read year, month and day back and compare with what
  you were given.
- **c.** `every` on the query's words.

## Check your work

```bash
npx academy check m2-p4
```

The checker also runs your `schoolToday` on a pretend computer in Kiribati (UTC+14) and one in
Los Angeles (UTC−8).

## Compare with GPIS

Read the comment at the top of `src/lib/school-date.ts` in your read-only copy. Write one
sentence in your notes: why does GPIS name the zone, when Ghana is UTC+0 all year?
