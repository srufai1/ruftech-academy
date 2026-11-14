# Guided example — Lunch money

The canteen's lunch-money module has a bug. You will read it, prove the bug with a test, fix
one expression, and commit the test and the fix separately.

**Type every command yourself.** Do not paste — except the two files below, which are
someone else's code.

## Step 1 — Read the contract

```bash
mkdir -p ~/academy-labs/scratch/u2-5
```

```bash
cd ~/academy-labs/scratch/u2-5
```

```bash
echo '{ "type": "module", "scripts": { "test": "node --test" } }' > package.json
```

`lunch.ts`:

```ts
// Lunch money at the canteen. All amounts are whole pesewas: 100 pesewas = 1 cedi.

/** The change to give back, in pesewas. Refuses a payment that is too small. */
export function changeDue(paid: number, price: number): number {
  if (!Number.isInteger(paid) || !Number.isInteger(price)) {
    throw new TypeError("amounts are whole pesewas");
  }
  if (paid < price) {
    throw new RangeError("the payment is less than the price");
  }
  return paid - price;
}

/** An amount in pesewas, written for a receipt: GHS 12.50 */
export function formatGhs(pesewas: number): string {
  const cedis = Math.floor(pesewas / 100);
  const rest = pesewas % 100;
  return `GHS ${cedis}.${rest}`;
}
```

`lunch.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { changeDue, formatGhs } from "./lunch.ts";

test("change from 20 cedis for a 12.50 lunch", () => assert.equal(changeDue(2000, 1250), 750));
test("too little money is refused", () => assert.throws(() => changeDue(1000, 1250), RangeError));
test("12.50 is written GHS 12.50", () => assert.equal(formatGhs(1250), "GHS 12.50"));
```

```bash
git init -b main
```

Set your name and email for this repository, as in unit 1.4. Then:

```bash
git add . && git commit -m "Add the lunch money module"
```

```bash
npm test
```

Expected: `# pass 3`. Read the three tests, then write one sentence per function in a file
`NOTES.md`.

## Step 2 — The report, as a test

The cashier says: "Change of 5 pesewas shows as GHS 0.5 on the receipt."

Add to `lunch.test.ts`:

```ts
test("5 pesewas is written GHS 0.05", () => assert.equal(formatGhs(5), "GHS 0.05"));
```

```bash
npm test
```

Expected: one failure. Read it: `actual: 'GHS 0.5'`, `expected: 'GHS 0.05'`. It fails for
the right reason — the wrong text, not a typo.

## Step 3 — Shrink

```bash
node -e 'import("./lunch.ts").then(({ formatGhs }) => console.log([5, 50, 105, 1250].map(formatGhs).join(" | ")))'
```

Expected: `GHS 0.5 | GHS 0.50 | GHS 1.5 | GHS 12.50`. The bug appears when the pesewas part
is below 10.

## Step 4 — Look at the two halves

For 105, `cedis` is 1 and `rest` is 5. Both numbers are right. The fault is in how `rest` is
**written**: 5 needs a leading zero.

## Step 5 — Fix one expression

In `formatGhs`, change `${rest}` to `${String(rest).padStart(2, "0")}`. Nothing else.

```bash
npm test
```

Expected: `# pass 4`. Run the step 3 command again: `GHS 0.05 | GHS 0.50 | GHS 1.05 | GHS 12.50`.

## Step 6 — Two commits

```bash
git diff --stat
```

Expected: `lunch.test.ts` and `lunch.ts`, a few lines. Commit the test first:

```bash
git add lunch.test.ts && git commit -m "Test: amounts below 10 pesewas get a leading zero"
```

```bash
git add -p lunch.ts
```

Git shows each change and asks `Stage this hunk?` — answer `y`.

```bash
git commit -m "Fix: pad the pesewas part of an amount to two digits"
```

```bash
git log --oneline
```

Expected: the `Fix:` commit, the `Test:` commit, the first commit.

## Step 7 — What you left alone

Did you want to rename `rest`, add a check for negative amounts, or move the two functions
into separate files? Write it in `NOTES.md` as "noticed, not changed". That is the GPIS rule:
say so, and leave it.

## What you used

reading tests as a contract · a reproducing test · shrinking · `git diff --stat` ·
`git add -p` · two commits per bug
