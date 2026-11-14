# Debugging lab — Third out of two

**Rule for every debugging lab:** find the cause before you change anything. GPIS works by
the same rule: OBSERVE → ISOLATE → TEST → PROVE → DOCUMENT → MOVE ON.

## The report

A teacher says: "Two pupils tied for first. One card says 1st, the other 2nd." Later: "After I
opened the ranking, the class list on my screen was in a different order."

## Start

```bash
mkdir -p ~/academy-labs/scratch/u2-2-debug
```

```bash
cd ~/academy-labs/scratch/u2-2-debug
```

```bash
echo '{ "type": "module", "scripts": { "test": "node --test" } }' > package.json
```

Your colleague's code. Make the two files with `nano`, exactly as shown.

`positions.mjs`:

```js
// Gives each student a position in the class, best total first.
export function rankClass(students) {
  const sorted = students.sort((a, b) => b.total - a.total);
  return sorted.map((student, index) => ({ id: student.id, position: index + 1 }));
}
```

`positions.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { rankClass } from "./positions.mjs";

const positionsOf = (students) => rankClass(students).map((row) => `${row.id}:${row.position}`);

test("one student is first", () => assert.deepEqual(positionsOf([{ id: "ama", total: 70 }]), ["ama:1"]));
test("two students, best first", () => assert.deepEqual(positionsOf([{ id: "ama", total: 90 }, { id: "kofi", total: 80 }]), ["ama:1", "kofi:2"]));
test("the best student is found when listed last", () => assert.deepEqual(positionsOf([{ id: "ama", total: 60 }, { id: "kofi", total: 85 }]), ["kofi:1", "ama:2"]));
test("three students in reverse order", () => assert.deepEqual(positionsOf([{ id: "a", total: 50 }, { id: "b", total: 60 }, { id: "c", total: 70 }]), ["c:1", "b:2", "a:3"]));
test("an empty class gives no rows", () => assert.deepEqual(rankClass([]), []));
```

```bash
npm test
```

Expected: `# pass 5`. Green — and wrong.

## Your work

Do not fix anything yet. Make `diagnosis.md` with these headings:

| Heading | What to write |
| :--- | :--- |
| `## Observe` | The input and the output for totals 80, 90, 90 (in that order) |
| `## Possible causes` | At least three, for example: the compare function is wrong; the position comes from the index; the two totals differ by a tiny decimal |
| `## Tests` | Commands and output: print the totals; rank 90, 90; print the caller's list after the call |
| `## Cause` | The cause the evidence supports |
| `## Fix` | The smallest change, and the test that proves it |

A useful command:

```bash
node -e '
import("./positions.mjs").then(({ rankClass }) => {
  const list = [{ id: "esi", total: 80 }, { id: "yaw", total: 90 }, { id: "abena", total: 90 }];
  console.log(JSON.stringify(rankClass(list)));
  console.log(list.map((s) => s.id).join(", "));
})'
```

There are **two** faults. For the second, write a test that keeps a copy of the input and
compares it after the call. Write each new test **before** its fix, and see it fail.

## Fixed state

- 90, 90, 80 gives positions 1, 1, 3.
- After the call, the caller's array is in its original order.
- Two new tests, each written before its fix. The five old tests still pass.

## Who checks it

This lab is **self-reviewed**. The checker does not mark it. Compare your `diagnosis.md` with
the five headings, and ask yourself: did I write the cause before I changed the code?
