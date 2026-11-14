# Debugging lab — The pupil who got zero

**Rule for every debugging lab:** find the cause before you change anything. GPIS works by
the same rule: OBSERVE → ISOLATE → TEST → PROVE → DOCUMENT → MOVE ON.

## The report

A teacher says: "I typed 0 for a pupil who handed in no project. The sheet says the mark is
missing, and there is no total." Keep that report in mind: after one fix, a second report
will make sense.

## Start

```bash
mkdir -p ~/academy-labs/scratch/u2-3-debug
```

```bash
cd ~/academy-labs/scratch/u2-3-debug
```

```bash
echo '{ "type": "module", "scripts": { "test": "node --test" } }' > package.json
```

Your colleague's code. Make the two files with `nano`, exactly as shown.

`entry.ts`:

```ts
// Reads marks typed on the score sheet, and adds up a row.
export type Mark = number | null;

export function readMark(text: string, max: number): Mark {
  const value = Number(text.trim());
  if (Number.isNaN(value)) return null;
  if (value < 0 || value > max) throw new RangeError(`a mark must be from 0 to ${max}`);
  return value;
}

export function sheetTotal(row: Mark[]): number | null {
  let sum = 0;
  for (const mark of row) {
    if (!mark) return null;
    sum += mark;
  }
  return sum;
}
```

`entry.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { readMark, sheetTotal } from "./entry.ts";

test("12 is read as 12", () => assert.equal(readMark("12", 15), 12));
test("7.5 is read as 7.5", () => assert.equal(readMark("7.5", 15), 7.5));
test("16 is refused for a maximum of 15", () => assert.throws(() => readMark("16", 15), RangeError));
test("text that is not a number is no mark", () => assert.equal(readMark("abc", 15), null));
test("a full row is added up", () => assert.equal(sheetTotal([12, 13, 14, 10]), 49));
test("a row with a missing mark has no total", () => assert.equal(sheetTotal([12, null, 14, 10]), null));
test("a row of maxima is 60", () => assert.equal(sheetTotal([15, 15, 15, 15]), 60));
```

```bash
npm test
```

Expected: `# pass 7`.

## Your work

Do not fix anything yet. Make `diagnosis.md` with these headings:

| Heading | What to write |
| :--- | :--- |
| `## Observe` | The row from the report, and what the functions return |
| `## Possible causes` | At least three, for example: a wrong maximum; a blank read as 0; the total ignores missing parts |
| `## Tests` | Calls and output: `readMark("", 15)`; `readMark("0", 15)`; `sheetTotal` with a 0 and with a `null` |
| `## Cause` | The cause the evidence supports |
| `## Fix` | The smallest change, and the test that proves it |

A useful command:

```bash
node -e 'import("./entry.ts").then(({ readMark, sheetTotal }) => console.log(readMark("", 15), readMark("0", 15), sheetTotal([12, 0, 14, 10])))'
```

There are **two** faults. When the first is fixed, a second report arrives: "A teacher left
Project Work empty for another pupil. Now the sheet shows a total, and it is low." Observe it
as a new problem. Before each fix, write a test that fails because of it.

In `## Cause`, quote the GPIS rule D-10: "A missing score prints blank, never 0."

## Fixed state

- `readMark("", 15)` gives `null`. `readMark("0", 15)` gives 0.
- A row with one blank has no total. A row with a 0 has a total.
- Two new tests; the seven old tests still pass.
- D-10 is quoted in `diagnosis.md`.

## Who checks it

This lab is **self-reviewed**. The checker does not mark it. Compare your `diagnosis.md` with
the five headings, and ask yourself: did I see each new test fail before I fixed the code?
