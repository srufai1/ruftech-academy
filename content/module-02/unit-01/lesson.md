# Values, functions and tests

This lesson has two parts. Part A is the language: values, names, comparing and functions.
Part B is how you prove a function is right.

## Part A

## A1. Running JavaScript

`node file.mjs` runs a file. `node` alone opens the **REPL**: you type a line, it answers.
`.exit` leaves. `console.log(x)` prints a value — use it to look, never inside a rule
function. A rule function returns its answer; it does not print.

## A2. Values

| Kind | Examples | `typeof` gives |
| :--- | :--- | :--- |
| number | `80`, `79.5`, `-1` | `"number"` |
| string (text) | `"80"`, `"High"` | `"string"` |
| boolean | `true`, `false` | `"boolean"` |
| nothing yet | `undefined` | `"undefined"` |
| nothing, on purpose | `null` | `"object"` (an old mistake in the language) |

`NaN` means "not a number", but `typeof NaN` is `"number"`. `0 / 0` and `Number("abc")` give
`NaN`. `Number.isFinite(x)` is true only for a real, finite number: false for `NaN`,
`Infinity` and any string.

## A3. Names

`const total = 80;` gives a name to a value. Use `const` first. Use `let` only when the value
must change. Never `var`.

## A4. Comparing

- `===` is "same kind and same value". `==` converts first, and surprises you. Use `===`.
- `<`, `<=`, `>`, `>=` compare numbers.
- `&&` is "and", `||` is "or", `!` is "not".

The trap: `"80" >= 80` is `true`, because `>=` turns the text into a number. But
`"80" === 80` is `false`. A score that arrives as text can pass one check and fail another.

## A5. Functions

```js
function remarkFor(total) {
  if (total >= 80) return "Highest";
  return "Lower";
}
```

A function has **parameters** (`total`) and **returns** a value. `return` ends it at once — an
**early return**. One function, one job.

## A6. Choosing

D-01 is a scale of nine bands. Check from the **top** band down, with `>=`:

```text
 0         40   45   50   55   60   65   70        80              100
 ├─Lowest──┼─Lr─┼─L──┼─LA─┼─Av─┼─HA─┼─H──┼─Higher──┼────Highest─────┤
           ↑ each band starts AT its lower number: 40 is Lower, 39.9 is Lowest
```

Checked from the top, the first `>=` that is true gives the band. Checked from the bottom,
`total >= 0` is true for everything, so every remark would be "Lowest".

A second way: put the bands in an **array** of objects and loop over it. The words are typed
once, in the table.

```js
const BANDS = [{ low: 80, label: "Highest" }, { low: 70, label: "Higher" } /* … */];
for (const band of BANDS) {
  if (total >= band.low) return band.label;
}
```

Stop here. Do steps 1–4 of the guided example. Then read Part B.

## Part B

## B1. Modules

```js
// src/lib/grading.mjs
export function remarkFor(total) { … }
```

```js
// tests/grading.test.mjs
import { remarkFor } from "../src/lib/grading.mjs";
```

The import path starts with `./` or `../` and names the file with its ending.

## B2. Tests

Node has a test runner. A test is a sentence about the rule, and a check:

```js
import { test } from "node:test";
import assert from "node:assert/strict";

test("80 is Highest", () => {
  assert.equal(remarkFor(80), "Highest");
});
```

`"test": "node --test"` in `package.json` makes `npm test` run every `*.test.mjs` file.

Write the test **first**. Run it and watch it fail. Then write the code that makes it pass.
A test you never saw fail may be testing nothing.

## B3. Boundaries

A band has two edges. Most mistakes happen exactly at an edge. Test both sides of every
edge: 79 and 80; 69 and 70; 64 and 65; and so on. A "typical value" in the middle of a band
proves almost nothing.

## B4. Refusing

When the input is wrong, **throw** an error:

```js
if (typeof total !== "number") throw new TypeError("total must be a number");
if (!Number.isFinite(total) || total < 0 || total > 100) throw new RangeError("total must be 0 to 100");
```

`TypeError` for the wrong kind of value; `RangeError` for a number outside the range. Test it:
`assert.throws(() => remarkFor(101), RangeError)`.

Why throw? A wrong remark on a report card looks normal, and nobody notices. An error is
noticed at once.

## B5. In GPIS

D-01: "one scale for every screen and document that uses it, calculated from the score, never
stored". One function is used everywhere. Because the remark is worked out when needed, a
change of scale can never leave old, wrong words in the database.

## Common mistakes

1. Testing only a typical value in each band → an off-by-one at 80 passes → test both sides
   of every edge.
2. `if (total > 80)` → 80 itself falls into "Higher" → the scale says 80–100.
3. Checking bands from the bottom with `>=` → everything is "Lowest" → start from the top.
4. Returning `undefined` for bad input → the card prints "undefined" → throw.
5. Writing the code first and the tests after → the tests copy the bugs → write the failing
   test first.

## Words to remember

value · `typeof` · `NaN` · `const` · `===` · function · parameter · return · early return ·
module · export · import · test · assertion · boundary · throw · `TypeError` · `RangeError`
