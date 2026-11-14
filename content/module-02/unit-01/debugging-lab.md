# Debugging lab — Half the class is "High"

**Rule for every debugging lab:** find the cause before you change anything. GPIS works by
the same rule: OBSERVE → ISOLATE → TEST → PROVE → DOCUMENT → MOVE ON.

## The report

A colleague wrote a remark function. Her six tests pass. Then a teacher rings: "A pupil with
exactly 70 has no remark. So does a pupil with 64.5. The card shows `undefined`."

## Start

```bash
mkdir -p ~/academy-labs/scratch/u2-1-debug
```

```bash
cd ~/academy-labs/scratch/u2-1-debug
```

```bash
echo '{ "type": "module", "scripts": { "test": "node --test" } }' > package.json
```

Her code. Make the two files with `nano`, exactly as shown.

`remark.mjs`:

```js
// Gives the remark for a total, using the school's scale.
const BANDS = [
  { low: 80, high: 100, label: "Highest" },
  { low: 70, high: 79, label: "Higher" },
  { low: 65, high: 69, label: "High" },
  { low: 60, high: 64, label: "High Average" },
  { low: 55, high: 59, label: "Average" },
  { low: 50, high: 54, label: "Low Average" },
  { low: 45, high: 49, label: "Low" },
  { low: 40, high: 44, label: "Lower" },
  { low: 0, high: 39, label: "Lowest" },
];

export function remark(total) {
  for (const band of BANDS) {
    if (total > band.low && total <= band.high) return band.label;
  }
}
```

`remark.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { remark } from "./remark.mjs";

test("90 is Highest", () => assert.equal(remark(90), "Highest"));
test("75 is Higher", () => assert.equal(remark(75), "Higher"));
test("67 is High", () => assert.equal(remark(67), "High"));
test("52 is Low Average", () => assert.equal(remark(52), "Low Average"));
test("42 is Lower", () => assert.equal(remark(42), "Lower"));
test("10 is Lowest", () => assert.equal(remark(10), "Lowest"));
```

```bash
npm test
```

Expected: `# pass 6`. Green — and wrong.

## Your work

Do not fix anything yet. Make `diagnosis.md` with these headings:

| Heading | What to write |
| :--- | :--- |
| `## Observe` | The two inputs from the report and what `remark` returns for each |
| `## Possible causes` | At least three, for example: wrong numbers in the table; a wrong comparison; rounding |
| `## Tests` | Calls with 69, 70, 71 and with 64, 64.5, 65, and their output. For example `node -e 'import("./remark.mjs").then((m) => console.log(m.remark(70)))'` |
| `## Cause` | The cause the evidence supports |
| `## Fix` | The smallest change, and the test that proves it |

There are **two** faults. Before each fix, write a new test that fails because of it. Fix one
fault, run your tests, and observe again: a **different** wrong answer may appear before the
second fix. Write that down too.

## Fixed state

- Each of the nine lower edges (80, 70, 65, 60, 55, 50, 45, 40, 0) gives its own band.
- 64.5 gives "High Average".
- The six old tests still pass, and you added at least two new ones.
- The table still has nine rows. Each fix changes as little as possible.

## Who checks it

This lab is **self-reviewed**. The checker does not mark it. Compare your `diagnosis.md` with
the five headings, and ask yourself: did I see each new test fail before I fixed the code?
