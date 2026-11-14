# Dates, time zones and text

This lesson has two parts. Part A is about dates. Part B is about periods and text.

## Part A

## A1. Two different things

A **moment** is one point in time, the same everywhere: "the bell rang". A **calendar date**
is a day on a calendar, and which day it is depends on where you are. One moment:

```text
moment 2026-12-14T23:30:00Z
  Los Angeles  14 December, 15:30
  Accra        14 December, 23:30
  Tokyo        15 December, 08:30   ← already the next day
```

A birthday, a term's first day and an exam day are **calendar dates**.

## A2. `Date`

A JavaScript `Date` holds a **moment**. `new Date()` is "now". `toISOString()` writes it in
UTC: `2026-12-14T23:30:00.000Z`. The trap: `getDate()`, `getMonth()` and `getFullYear()` use
the time zone of **the computer the code runs on**. A server in Virginia gives a different
day from a laptop in Kumasi.

## A3. The school's zone

GPIS is in `Africa/Accra`. Name the zone every time:

```ts
now.toLocaleDateString("en-CA", { timeZone: "Africa/Accra" });   // "2026-12-14"
```

`en-CA` happens to write dates as `YYYY-MM-DD`. Ghana is UTC+0 all year, so UTC gives the same
day here — by luck. The server may be anywhere, and another school may not be at UTC+0.

## A4. Dates as text

GPIS keeps calendar dates as text, `YYYY-MM-DD`. In that form, text order is date order, so
`"2026-09-14" < "2026-12-18"` is a correct date comparison.

## A5. Real dates

`new Date("2026-02-30")` does not refuse: it quietly becomes 2 March. To check a date, build
it with `Date.UTC(year, month - 1, day)`, read the year, month and day back with
`getUTCFullYear()` and friends, and compare with what you were given. (Months count from 0
in `Date`.) 2028 is a leap year; 1900 was not; 2000 was.

## A6. Day arithmetic

Count whole days in UTC: `Date.UTC(…)` plus `days × 24 × 60 × 60 × 1000`, then
`toISOString().slice(0, 10)`. Never add hours to a local time: in countries with summer time,
some days have 23 or 25 hours.

Stop here. Do steps 1–4 of the guided example. Then read Part B.

## Part B

## B1. Periods

A term has `startsOn` and `endsOn`, and **both days are included**. "Which term is this date
in?" can have the answer "none": the holidays. Compare calendar dates as text with `<=` on
both ends. Do not turn `endsOn` into a moment: midnight at the **start** of the last day
would leave the rest of that day out.

## B2. Text

| Tool | Does |
| :--- | :--- |
| `trim()` | Removes spaces at both ends |
| `toLocaleLowerCase()` | Lower case |
| `split(/\s+/)` | Cuts at runs of spaces |
| `filter(Boolean)` | Drops empty pieces |
| `includes(x)` | Is `x` inside? |
| `replaceAll(".", " ")` | Replaces every full stop |

`"  Ama   Birikran ".trim().split(" ")` gives four pieces, two of them empty. Split on
`/\s+/`, or filter the empty ones out.

## B3. A little pattern language

`/\./g` is "every full stop". `\s+` is "one or more spaces". `^…$` is "the whole text".
`pattern.test(text)` asks whether it matches; `text.replace(pattern, "")` removes matches.

## B4. Matching names

D-247: a name search matches when **every typed word** appears somewhere in the first, middle
or last name, **in any order**; full stops are ignored. So `o. adu` finds "Godfred O. Adu",
and `asante g.` finds "Godfred Kofi Asante". A plain `name.includes(query)` fails both.

## B5. Clocks in tests

A function that reads the clock gives a different answer each day, so it cannot be tested.
Give it the moment as a parameter with a default: `schoolToday(now: Date = new Date())`. The
app calls it without an argument; the test passes a fixed moment.

## In GPIS

`src/lib/school-date.ts` holds `SCHOOL_TIME_ZONE = "Africa/Accra"` and does day arithmetic on
whole calendar days in UTC. `nameSearchWords` in `name-class-search.ts` carries out D-247.

## Common mistakes

1. `new Date().toISOString().slice(0, 10)` for "today" → right in Accra by luck, wrong for
   any other zone → name the zone.
2. `new Date("2026-02-30")` → becomes 2 March → read the parts back.
3. Comparing two `Date` objects with `===` → always false → compare the text or `getTime()`.
4. Ending a period at midnight → the last day is left out → compare calendar dates with `<=`.
5. `name.includes(query)` → "adu godfred" does not find "Godfred Adu" → split the query into
   words.

## Words to remember

moment · calendar date · UTC · time zone · `Africa/Accra` · `YYYY-MM-DD` · leap year ·
period · both ends included · `split` · `trim` · pattern · `now` parameter
