# Guided example — Parsing a height

A form asks for a pupil's height in centimetres. The rules: **50 to 250, at most one
decimal; blank is allowed; `N/A` is allowed.** A different field from the lab, the same
technique.

**Type every command yourself.** Do not paste.

## Step 1 — TypeScript

```bash
mkdir -p ~/academy-labs/scratch/u2-3/src ~/academy-labs/scratch/u2-3/tests
```

```bash
cd ~/academy-labs/scratch/u2-3
```

```bash
npm init -y && npm pkg set type=module scripts.test="node --test" scripts.typecheck="tsc --noEmit"
```

```bash
npm install --save-dev typescript @types/node
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "target": "es2023",
    "allowImportingTsExtensions": true,
    "erasableSyntaxOnly": true,
    "types": ["node"]
  },
  "include": ["src", "tests"]
}
```

```bash
npm run typecheck
```

Expected: `error TS18003: No inputs were found in config file`. There is no code yet; that
is fine.

## Step 2 — Types first

`src/height.ts`:

```ts
export type Height = number | "N/A" | null;
export type Result<T> = { ok: true; value: T } | { ok: false; error: string };
```

`Result<T>` is a type with a blank to fill: `Result<Height>` is a result whose value is a
`Height`.

## Step 3 — Blank, test first

`tests/height.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseHeight } from "../src/height.ts";

test("blank is null", () => {
  for (const blank of ["", "   ", null, undefined]) {
    assert.deepEqual(parseHeight(blank), { ok: true, value: null });
  }
});
```

Run `npm test`: it fails, `parseHeight` does not exist. Add to `src/height.ts`:

```ts
export function parseHeight(input: unknown): Result<Height> {
  if (input === null || input === undefined) return { ok: true, value: null };
  if (typeof input !== "string") return { ok: false, error: "A height must be typed as text." };
  const text = input.trim();
  if (text === "") return { ok: true, value: null };
  return { ok: false, error: "Not ready yet." };
}
```

Run `npm test`: green.

## Step 4 — N/A

Add a test: `"n/a"` and `"N/A "` give `{ ok: true, value: "N/A" }`. Run: red. Add, after the
blank line:

```ts
  if (text.toUpperCase() === "N/A") return { ok: true, value: "N/A" };
```

Green.

Stop here if you are between Part A and Part B of the lesson.

## Step 5 — The pattern

Tests: `"170"` → 170, `"170.5"` → 170.5. Refused: `"170.55"`, `"1e2"`, `"17O"` (a letter O).
Then, before the last `return`:

```ts
  if (!/^\d+(\.\d)?$/.test(text)) return { ok: false, error: `"${text}" is not a height in centimetres.` };
  const value = Number(text);
```

`^` and `$` make the pattern match the **whole** text. `\d+` is one or more digits;
`(\.\d)?` is an optional point and one digit.

## Step 6 — The range, and what `tsc` refuses

Add the range check (50 to 250), with tests for 49.9 and 250.1. Then try this in a test:

```ts
const result = parseHeight("170");
console.log(result.value);
```

```bash
npm run typecheck
```

Expected: `error TS2339: Property 'value' does not exist on type 'Result<Height>'`, and a
second line naming `{ ok: false; error: string; }`. TypeScript makes you check `result.ok`
first. Wrap it in `if (result.ok) { … }` and the error goes.
Remove the two lines again.

## Step 7 — Break it on purpose

Convert **before** the blank check, as many people do. Replace the line
`if (text === "") return { ok: true, value: null };` with these two:

```ts
  const early = Number(text);
  if (Number.isNaN(early)) return { ok: true, value: null };
```

```bash
npm test
```

Expected: three tests fail. The blank test fails because `Number("")` is 0, not `NaN`: a
blank box is no longer `null`. And any text that is not a number — `"N/A"`, `"17O"` — is now
taken for a blank. In the lab, the same mistake turns a blank mark into a 0. Put the original
line back and run `npm test`: green.

## Step 8 — Check and commit

```bash
npm run typecheck && npm test
```

```bash
git init -b main && git add package.json package-lock.json tsconfig.json src tests
```

```bash
git commit -m "Add parseHeight: blank, N/A or 50-250 cm with one decimal"
```

## What you used

`unknown` · union types · literal types · narrowing · a result type · a whole-text pattern ·
`tsc --noEmit`
