# Debugging lab — Last term's card shows this term's class

**Rule for every debugging lab:** find the cause before you change anything. GPIS works by
the same rule: OBSERVE → ISOLATE → TEST → PROVE → DOCUMENT → MOVE ON.

## The report

The head teacher says: "I reprinted Ama's Term 1 report card. It says Basic 3B. She was in
3A then." Keep a second report in mind: "Kofi left in November. His Term 1 card has no class
at all."

## Start

```bash
mkdir -p ~/academy-labs/scratch/u2-6-debug
```

```bash
cd ~/academy-labs/scratch/u2-6-debug
```

```bash
echo '{ "type": "module", "scripts": { "test": "node --test" } }' > package.json
```

Your colleague's code. Make the two files with `nano`, exactly as shown.

`card.ts`:

```ts
// The header printed at the top of a pupil's report card for one term.
export type Student = { id: number; firstName: string; lastName: string; status: "active" | "withdrawn" | "alumni" };
export type Membership = { studentId: number; classId: number; termIds: number[]; endedOn: string | null };
export type SchoolClass = { id: number; name: string };

export function reportHeader(student: Student, memberships: Membership[], classes: SchoolClass[], termId: number) {
  const name = `${student.firstName} ${student.lastName}`;
  if (student.status !== "active") return { name, className: null };
  const current = memberships.find((m) => m.studentId === student.id && m.endedOn === null);
  const schoolClass = classes.find((c) => c.id === current?.classId);
  return { name, className: schoolClass?.name ?? null };
}
```

`card.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { reportHeader } from "./card.ts";

const T1 = 1, T2 = 2;
const CLASSES = [{ id: 31, name: "Basic 3A" }, { id: 32, name: "Basic 3B" }];
const AMA = { id: 1, firstName: "Ama", lastName: "Mensah", status: "active" as const };
const YAW = { id: 2, firstName: "Yaw", lastName: "Ofori", status: "active" as const };
const KOFI = { id: 3, firstName: "Kofi", lastName: "Boateng", status: "withdrawn" as const };
const MEMBERSHIPS = [
  { studentId: 1, classId: 31, termIds: [T1], endedOn: "2026-12-18" },
  { studentId: 1, classId: 32, termIds: [T2], endedOn: null },
  { studentId: 2, classId: 32, termIds: [T1, T2], endedOn: null },
  { studentId: 3, classId: 31, termIds: [T1], endedOn: "2026-11-20" },
];

test("Ama's Term 2 card says Basic 3B", () => assert.equal(reportHeader(AMA, MEMBERSHIPS, CLASSES, T2).className, "Basic 3B"));
test("Yaw's Term 2 card says Basic 3B", () => assert.equal(reportHeader(YAW, MEMBERSHIPS, CLASSES, T2).className, "Basic 3B"));
test("the name is first name and last name", () => assert.equal(reportHeader(AMA, MEMBERSHIPS, CLASSES, T2).name, "Ama Mensah"));
test("Yaw's Term 1 card says Basic 3B", () => assert.equal(reportHeader(YAW, MEMBERSHIPS, CLASSES, T1).className, "Basic 3B"));
```

```bash
npm test
```

Expected: `# pass 4`. Every test asks about a pupil whose class never changed, or about
today's term.

## Your work

Do not fix anything yet. Make `diagnosis.md` with these headings:

| Heading | What to write |
| :--- | :--- |
| `## Observe` | Ama's and Kofi's Term 1 headers: what they say, and what they should say |
| `## Possible causes` | At least three, for example: the test data is wrong; the code uses the current class; the term ids are mixed up |
| `## Tests` | Calls with Term 1 and Term 2 for Ama and for Kofi; print the membership the code chose |
| `## Cause` | The cause the evidence supports |
| `## Fix` | The smallest change, and the test that proves it |

There are **two** faults. Fix Ama's first; Kofi's card will still be wrong. Observe again.
Before each fix, write a test that fails because of it.

In `## Cause`, quote D-21: a score records the membership it was earned under; the class on a
report card comes from that, never from a lookup of today. For Kofi, quote D-23: student
status and membership status are separate facts — and a past term's card is about the past.

## Fixed state

- Ama: Term 1 → Basic 3A; Term 2 → Basic 3B.
- Kofi's Term 1 card → Basic 3A.
- Two new tests; the four old tests still pass.
- D-21 is quoted in `diagnosis.md`.

## Who checks it

This lab is **self-reviewed**. The checker does not mark it. Compare your `diagnosis.md` with
the five headings, and ask yourself: did I write the cause before I changed the code?
