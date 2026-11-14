# TypeScript and input you cannot trust

This lesson has two parts. Part A adds types to JavaScript. Part B uses them to read marks
that a person typed.

## Part A

## A1. Why types

A test checks the cases you thought of. A **type** checks every call, everywhere, before the
code runs. TypeScript is JavaScript with types written in. The type checker (`tsc`) reads
them; Node removes them and runs the rest.

## A2. Setting up

```bash
npm install --save-dev typescript @types/node
```

`tsconfig.json` tells `tsc` how strict to be. This course uses `strict`,
`noUncheckedIndexedAccess`, `noEmit`, `module` and `moduleResolution` `nodenext`, `target`
`es2023`, `allowImportingTsExtensions`, `erasableSyntaxOnly`, `types: ["node"]`, and
`include: ["src", "tests"]`. Add `"typecheck": "tsc --noEmit"` to `package.json`.

Node 22.18 and later runs `.ts` files directly. So: imports name the file with `.ts`, and you
use only types that can be erased — no `enum`, no `namespace`.

## A3. Basic types

```ts
function remarkFor(total: number): string { … }
const totals: number[] = [90, 80];
type Pupil = { id: string; middleName?: string };   // ? means "may be missing"
```

`type` gives a name to a shape. `readonly number[]` is an array you promise not to change.

## A4. Unions and literals

A **union** is "one of these": `type RawMark = number | "ABS" | null;`. `"ABS"` here is a
**literal** type: exactly that text.

To use a union, **narrow** it with a check. Inside the check, TypeScript knows which one you
have:

```ts
if (mark === null) return "blank";
if (mark === "ABS") return "absent";
return mark.toFixed(2);   // here mark can only be a number
```

## A5. `unknown` at the edge

A value from a form, a file or a request could be anything. Give it the type `unknown`.
TypeScript will not let you use it until you check what it is. **Never use `any`**: it
switches checking off, and the mistake runs anyway. `x as number` is the same lie in another
form.

Stop here. Do steps 1–4 of the guided example. Then read Part B.

## Part B

## B1. Results, not exceptions

A teacher typing `16` in a box out of 15 is not a crash. It is an answer to give back. Return
a **result**:

```ts
type MarkResult = { ok: true; value: RawMark } | { ok: false; error: string };
```

This is a **discriminated union**: `ok` tells which shape you have. TypeScript will not let
the caller read `value` before checking `ok`.

## B2. Parsing a mark

```text
text from the box ──▶ parseMark ──▶ number │ "ABS" │ null │ error
                                     └──────────┬──────────┘
                                          calculateTotal ──▶ total, or null
```

In order: trim the spaces; blank gives `null`; `ABS` in any case gives `"ABS"`; then the
**whole** text must match a strict pattern — digits, and at most two decimals:
`/^\d+(\.\d{1,2})?$/`. That refuses `"1e2"`, `"0x10"`, `" -1"`, `"12."` and `"12abc"`, which
`Number` or `parseFloat` would accept. Last, the range: 0 to the maximum.

## B3. Zero, blank, ABS

Three different facts:

| Value | Means | Prints |
| :--- | :--- | :--- |
| `0` | The pupil scored nothing | 0 |
| `null` | Nothing was entered | blank |
| `"ABS"` | The pupil was absent | ABS |

None may turn into another (D-162, D-10). The traps: `Number("")` is 0, and `x || null`
turns a real 0 into `null`.

## B4. The total

D-162 for Creche to JHS 2: four parts out of 15 (Individual Test, Class Test, Group Work,
Project Work) give CA raw out of 60, scaled to 50. The exam is scaled to 50. Final = CA
scaled + exam scaled, out of 100. Round each number to two decimals.

A total exists **only** when all five parts are numbers. One blank or one `ABS`: no total.

## B5. Maxima are data

The exam maximum arrives as an argument, because GPIS stores the maximum on each record
(D-27). D-171: JHS Integrated Science is marked out of 140 — the same function, another
number. 112 out of 140 scales to 40.

## B6. In GPIS

`raw-marks.ts` has the same rules. GPIS checks them three times: in the browser, in the
Server Action, and by CHECK constraints in the database. The first two can be skipped by a
clever user; the database cannot.

## Common mistakes

1. `Number("")` is 0 → a blank becomes a zero → test for blank **before** converting.
2. `value || null` → a real 0 becomes `null` → compare with `=== null`.
3. `parseFloat("12abc")` is 12 → rubbish is accepted → match the whole text with a pattern.
4. `as number` to silence an error → the wrong value runs anyway → narrow with a check.
5. `ABS` counted as 0 in the total → an absent pupil gets a low grade → no total.

## Words to remember

type · `tsc` · union · literal type · narrowing · `unknown` · `any` · discriminated union ·
result type · pattern · blank · `ABS` · maximum
