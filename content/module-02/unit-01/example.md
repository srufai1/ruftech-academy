# Guided example — Pass or fail

You will build a small rule, test first: **50 and above is `"pass"`, below 50 is `"fail"`,
and anything outside 0–100 is refused.** This rule is not a GPIS rule, so the lab is still
yours to solve.

**Type every command yourself.** Do not paste.

## Step 1 — A small project

```bash
mkdir -p ~/academy-labs/scratch/u2-1
```

```bash
cd ~/academy-labs/scratch/u2-1
```

```bash
npm init -y
```

```bash
npm pkg set type=module scripts.test="node --test"
```

```bash
mkdir -p src tests
```

## Step 2 — The first test, before any code

With `nano`, write `tests/pass.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { passOrFail } from "../src/pass.mjs";

test("50 is pass", () => {
  assert.equal(passOrFail(50), "pass");
});
```

```bash
npm test
```

Expected: a failure that contains `Cannot find module` and `src/pass.mjs`. Read it: the test
looked for code that does not exist yet. That is the right first failure.

## Step 3 — The smallest code

`src/pass.mjs`:

```js
export function passOrFail(score) {
  if (score >= 50) return "pass";
  return "fail";
}
```

```bash
npm test
```

Expected: `# pass 1` and `# fail 0`.

## Step 4 — More edges

Add three tests: 49 is `"fail"`, 0 is `"fail"`, 100 is `"pass"`. **Before** you run, predict:
will any fail?

```bash
npm test
```

Expected: `# pass 4`. The code already handles them. 49 and 50 are the two sides of the only
edge.

Stop here if you are between Part A and Part B of the lesson.

## Step 5 — Refuse a number outside the range

Add a test:

```js
test("101 is refused", () => {
  assert.throws(() => passOrFail(101), RangeError);
});
```

```bash
npm test
```

Expected: one failure, `Missing expected exception (RangeError)`. Now add the check as the
first line of the function:

```js
  if (score < 0 || score > 100) throw new RangeError("score must be 0 to 100");
```

Run again. Expected: all pass.

## Step 6 — Refuse what is not a number

Add tests for `-1` (`RangeError`), `NaN` (`RangeError`) and `"50"` (`TypeError`). Run: two
fail. Change the start of the function:

```js
  if (typeof score !== "number") throw new TypeError("score must be a number");
  if (!Number.isFinite(score) || score < 0 || score > 100) throw new RangeError("score must be 0 to 100");
```

Run again. Expected: all pass.

## Step 7 — See the trap

Remove `!Number.isFinite(score) ||` from the second line. Then:

```bash
node -e 'import("./src/pass.mjs").then((m) => console.log(m.passOrFail(NaN)))'
```

Expected: `fail`. Every comparison with `NaN` is false, so `NaN` slips past `< 0` and
`> 100`, and lands in "fail". A pupil whose mark was lost would be told they failed. Put the
check back and run `npm test`: all pass.

## Step 8 — Commit the rule with its tests

```bash
git init -b main
```

```bash
git add package.json src tests
```

```bash
git commit -m "Add passOrFail: 50 and above passes, outside 0-100 is refused"
```

Test and code go in together. The message says the rule.

## What you used

`const` · `function` · `if` · `===` · `typeof` · `Number.isFinite` · `throw` · `export` /
`import` · `node --test` · `assert.equal` · `assert.throws`
