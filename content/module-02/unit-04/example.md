# Guided example — Library due dates

A made-up library in Tokyo lends books for **14 days**. You will work out "today at the
library", due dates and overdue books, and search titles in any word order. Tokyo, not Accra,
so the lab is still yours to solve.

**Type every command yourself.** Do not paste.

## Step 1 — One moment, two dates

```bash
mkdir -p ~/academy-labs/scratch/u2-4/src ~/academy-labs/scratch/u2-4/tests
```

```bash
cd ~/academy-labs/scratch/u2-4
```

```bash
node -e 'const m = new Date("2026-12-14T23:30:00Z"); console.log(m.toISOString(), m.toLocaleDateString("en-CA", { timeZone: "Asia/Tokyo" }))'
```

Expected: `2026-12-14T23:30:00.000Z 2026-12-15`. The same moment is the 15th in Tokyo.

Set up the project as in unit 2.3 (`package.json` with `type`, `test` and `typecheck`; the
same `tsconfig.json`; `npm install --save-dev typescript @types/node`).

## Step 2 — "Today at the library", testable

`src/library.ts`:

```ts
export const LIBRARY_TIME_ZONE = "Asia/Tokyo";

export function libraryToday(now: Date = new Date()): string {
  return now.toLocaleDateString("en-CA", { timeZone: LIBRARY_TIME_ZONE });
}
```

`tests/library.test.ts` — three fixed moments:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { libraryToday } from "../src/library.ts";

test("14:59 UTC is still the 14th in Tokyo", () => assert.equal(libraryToday(new Date("2026-12-14T14:59:00Z")), "2026-12-14"));
test("15:00 UTC is the 15th in Tokyo", () => assert.equal(libraryToday(new Date("2026-12-14T15:00:00Z")), "2026-12-15"));
test("23:30 UTC is the 15th in Tokyo", () => assert.equal(libraryToday(new Date("2026-12-14T23:30:00Z")), "2026-12-15"));
```

```bash
npm test
```

Expected: `# pass 3`.

## Step 3 — Pretend the computer is elsewhere

```bash
TZ=America/Los_Angeles npm test
```

Expected: still `# pass 3`. `TZ` sets the computer's zone for one command; the function names
its own zone, so it does not care. Now change `libraryToday` to use the machine's clock:

```ts
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${m}-${d}`;
```

```bash
TZ=America/Los_Angeles npm test
```

Expected: failures. Put the zone-named version back.

## Step 4 — Real dates, test first

Tests: `isRealDate("2026-02-30")` is false; `isRealDate("2028-02-29")` is true. Run: red.
Then:

```ts
export function isRealDate(text: string): boolean {
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!parts) return false;
  const [y, m, d] = [Number(parts[1]), Number(parts[2]), Number(parts[3])];
  const back = new Date(Date.UTC(y, m - 1, d));
  return back.getUTCFullYear() === y && back.getUTCMonth() === m - 1 && back.getUTCDate() === d;
}
```

Green. Try `node -e 'console.log(new Date(Date.UTC(2026, 1, 30)).toISOString())'`: it prints
`2026-03-02T…`. That is why you read the parts back.

Stop here if you are between Part A and Part B of the lesson.

## Step 5 — The due date

Test: `dueDate("2026-12-25")` is `"2027-01-08"`. Then:

```ts
const DAY_MS = 24 * 60 * 60 * 1000;

export function dueDate(borrowedOn: string): string {
  if (!isRealDate(borrowedOn)) throw new RangeError(`${borrowedOn} is not a real date`);
  return new Date(Date.parse(`${borrowedOn}T00:00:00Z`) + 14 * DAY_MS).toISOString().slice(0, 10);
}
```

Whole days in UTC: no time zone can move it.

## Step 6 — Overdue, by comparing text

```ts
export function isOverdue(due: string, today: string): boolean {
  return today > due;
}
```

Tests: due `"2027-01-08"` is not overdue on `"2027-01-08"` (the due day itself is fine) and is
overdue on `"2027-01-09"`.

## Step 7 — Titles in any word order

```ts
const words = (text: string) => text.toLocaleLowerCase().split(/\s+/).filter(Boolean);

export function matchesTitle(title: string, query: string): boolean {
  const titleWords = words(title);
  return words(query).every((w) => titleWords.some((t) => t.includes(w)));
}
```

Tests: `matchesTitle("Things Fall Apart", "apart things")` is true; `"fall down"` is false.

## Step 8 — Check and commit

```bash
npm run typecheck && npm test
```

Commit, with a message that says what the library rules are.

## What you used

`Date` · `Date.UTC` · `toLocaleDateString` with `timeZone` · `TZ=` for one command · reading
date parts back · text comparison of dates · `split(/\s+/)` · `every` · a `now` parameter
