# Guided example — Fastest runners

Sports day. Runners have times in seconds; the **lowest** time wins. Here you use **dense**
ranking on purpose — the opposite of the lab on two counts (lowest first, and dense), so the
lab is still yours to solve.

**Type every command yourself.** Do not paste.

## Step 1 — A list of runners

```bash
mkdir -p ~/academy-labs/scratch/u2-2/src ~/academy-labs/scratch/u2-2/tests
```

```bash
cd ~/academy-labs/scratch/u2-2
```

```bash
echo '{ "type": "module", "scripts": { "test": "node --test" } }' > package.json
```

`src/race.mjs`:

```js
export const RUNNERS = [
  { name: "Kwame", seconds: 13.0 },
  { name: "Efua", seconds: 12.1 },
  { name: "Yaw", seconds: null },
  { name: "Akosua", seconds: 12.1 },
];
```

```bash
node -e 'import("./src/race.mjs").then(({ RUNNERS }) => console.log(RUNNERS.map((r) => r.name)))'
```

Expected: `[ 'Kwame', 'Efua', 'Yaw', 'Akosua' ]`

## Step 2 — Leave out who did not run

```bash
node -e 'import("./src/race.mjs").then(({ RUNNERS }) => console.log(RUNNERS.filter((r) => r.seconds !== null).length))'
```

Expected: `3`. Here a runner without a time is left out. **In the lab it is the other way**:
a pupil with a missing subject is still ranked (Q-07).

## Step 3 — Sort a copy

```bash
node -e '
import("./src/race.mjs").then(({ RUNNERS }) => {
  const ran = RUNNERS.filter((r) => r.seconds !== null);
  const fastest = ran.toSorted((a, b) => a.seconds - b.seconds);
  console.log(fastest.map((r) => r.name), ran.map((r) => r.name));
})'
```

Expected: `[ 'Efua', 'Akosua', 'Kwame' ] [ 'Kwame', 'Efua', 'Akosua' ]`. The copy is sorted;
the original is not. Efua stays before Akosua: the sort is stable.

## Step 4 — The default-sort trap

```bash
node -e 'console.log([10, 9, 100].sort())'
```

Expected: `[ 10, 100, 9 ]`. Without a compare function, numbers are sorted as text.

Stop here if you are between Part A and Part B of the lesson.

## Step 5 — Dense ranks, test first

`tests/race.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { denseRanks } from "../src/race.mjs";

test("12.1, 12.1, 13.0 gives 1, 1, 2", () => {
  assert.deepEqual(denseRanks([12.1, 12.1, 13.0]), [1, 1, 2]);
});
```

```bash
npm test
```

Expected: a failure — `denseRanks` does not exist. Now add to `src/race.mjs`:

```js
export function denseRanks(times) {
  const distinct = [...new Set(times)].toSorted((a, b) => a - b);
  return times.map((t) => distinct.indexOf(t) + 1);
}
```

`new Set(times)` keeps each value once. Run `npm test`: green.

## Step 6 — The input order is kept

Add a test: `denseRanks([13.0, 12.1, 12.1])` gives `[2, 1, 1]`. Run it before you change
anything. It passes: `map` walks the times in their original order, so each rank lands in the
right place.

## Step 7 — An average with `reduce`

```bash
node -e '
const times = [12.1, 12.1, 13.0];
const sum = times.reduce((total, t) => total + t, 0);
console.log(sum, Math.round((sum / times.length) * 100) / 100);'
```

Expected: `37.2` and `12.4`. Without rounding, decimals can show long tails such as
`0.30000000000000004`.

## Step 8 — Commit

```bash
git init -b main && git add package.json src tests
```

```bash
git commit -m "Add dense ranking of race times, fastest first"
```

## What you used

`map` · `filter` · `reduce` · `toSorted` with a compare function · `Set` · copy before sort ·
`Math.round` to two places
