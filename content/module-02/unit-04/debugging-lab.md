# Debugging lab — The term ended a day early

**Rule for every debugging lab:** find the cause before you change anything. GPIS works by
the same rule: OBSERVE → ISOLATE → TEST → PROVE → DOCUMENT → MOVE ON.

## The report

The school's new server is in New York. A teacher says: "On the last day of term the
dashboard says 'No current term'." Later: "Searching `kyei esi` finds nobody, but `esi kyei`
finds Esi Kyei."

## Start

```bash
mkdir -p ~/academy-labs/scratch/u2-4-debug
```

```bash
cd ~/academy-labs/scratch/u2-4-debug
```

```bash
echo '{ "type": "module", "scripts": { "test": "node --test" } }' > package.json
```

Your colleague's code. Make the two files with `nano`, exactly as shown.

`calendar.ts`:

```ts
// Which term are we in today, and which pupils match a search?
export type Term = { name: string; startsOn: string; endsOn: string };
export type Pupil = { id: string; name: string };

export function currentTerm(now: Date, terms: Term[]): Term | null {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  for (const term of terms) {
    const start = new Date(term.startsOn);
    const end = new Date(term.endsOn);
    if (today >= start && today <= end) return term;
  }
  return null;
}

export function findPupils(list: Pupil[], query: string): Pupil[] {
  return list.filter((pupil) => pupil.name.toLowerCase().includes(query.toLowerCase()));
}
```

`calendar.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { currentTerm, findPupils } from "./calendar.ts";

const TERMS = [
  { name: "Term 1", startsOn: "2026-09-14", endsOn: "2026-12-18" },
  { name: "Term 2", startsOn: "2027-01-11", endsOn: "2027-04-01" },
];
const PUPILS = [{ id: "p1", name: "Esi Kyei" }, { id: "p2", name: "Kwabena Ofori" }];

test("a day in the middle of Term 1", () => assert.equal(currentTerm(new Date("2026-10-20T10:00:00Z"), TERMS)?.name, "Term 1"));
test("the first day of Term 2", () => assert.equal(currentTerm(new Date("2027-01-11T08:00:00Z"), TERMS)?.name, "Term 2"));
test("the holidays are no term", () => assert.equal(currentTerm(new Date("2026-12-25T10:00:00Z"), TERMS), null));
test("the last day of Term 1", () => assert.equal(currentTerm(new Date("2026-12-18T10:00:00Z"), TERMS)?.name, "Term 1"));
test("a first name finds the pupil", () => assert.deepEqual(findPupils(PUPILS, "esi").map((p) => p.id), ["p1"]));
test("a full name finds the pupil", () => assert.deepEqual(findPupils(PUPILS, "Esi Kyei").map((p) => p.id), ["p1"]));
test("a name nobody has finds nobody", () => assert.deepEqual(findPupils(PUPILS, "kofi"), []));
```

```bash
TZ=UTC npm test
```

Expected: `# pass 7`. Now run it the way the New York server does:

```bash
TZ=America/New_York npm test
```

## Your work

Do not fix anything yet. Make `diagnosis.md` with these headings:

| Heading | What to write |
| :--- | :--- |
| `## Observe` | The date, the machine's zone, and the output — for both reports |
| `## Possible causes` | At least three, for example: the term data is wrong; the last day is not included; the machine's time zone |
| `## Tests` | Commands and output: the tests under `TZ=UTC`, `TZ=America/New_York` and `TZ=Asia/Tokyo`; print `new Date("2026-12-18").toISOString()`; `findPupils` with `kyei esi` |
| `## Cause` | The causes the evidence supports |
| `## Fix` | The smallest change, and the tests that prove it |

There are **two** faults. For the first, compare `YYYY-MM-DD` texts, and get "today" from a
named zone (`Africa/Accra`), not from the machine. For the second, think in words.

## Fixed state

- The last day of term gives Term 1 under every `TZ` you try.
- `kyei esi` finds Esi Kyei.
- New tests for both faults. The old tests pass under `TZ=America/New_York` and
  `TZ=Asia/Tokyo`.

## Who checks it

This lab is **self-reviewed**. The checker does not mark it. Compare your `diagnosis.md` with
the five headings, and ask yourself: did I write the cause before I changed the code?
