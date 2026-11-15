# Guided example — A lending library, typed

Books, members and loans. A book has **no** "borrower" field: who has it now is derived from
the open loan. The same idea as the lab, on another subject.

**Type every command yourself.** Do not paste.

## Step 1 — The shapes

```bash
mkdir -p ~/academy-labs/scratch/u2-6/src ~/academy-labs/scratch/u2-6/tests
```

```bash
cd ~/academy-labs/scratch/u2-6
```

Set up `package.json`, `tsconfig.json` and TypeScript as in unit 2.3. Then `src/library.ts`:

```ts
export type BookId = number & { readonly __brand: "BookId" };
export type MemberId = number & { readonly __brand: "MemberId" };
export const asBookId = (n: number) => n as BookId;
export const asMemberId = (n: number) => n as MemberId;

export type MemberStatus = "current" | "left";
export type Book = { readonly id: BookId; readonly title: string };
export type Member = { readonly id: MemberId; readonly name: string; readonly status: MemberStatus };
export type Loan = { readonly bookId: BookId; readonly memberId: MemberId; readonly lentOn: string; readonly returnedOn: string | null };
```

## Step 2 — An exact set

`MemberStatus` allows exactly two words. In a test file, write
`const m: Member = { id: asMemberId(1), name: "Esi", status: "curent" };` and run
`npm run typecheck`. Expected: `error TS2820: Type '"curent"' is not assignable to type
'MemberStatus'. Did you mean '"current"'?` Remove the line.

## Step 3 — Ids that cannot be mixed

Write `const wrong: MemberId = asBookId(5);` and run the type check. Expected: an error that
`BookId` is not assignable to `MemberId`. Remove the line.

## Step 4 — Who has the book now? Test first

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { asBookId, asMemberId, currentBorrower, type Loan } from "../src/library.ts";

const loans: Loan[] = [
  { bookId: asBookId(1), memberId: asMemberId(7), lentOn: "2026-11-01", returnedOn: "2026-11-10" },
  { bookId: asBookId(1), memberId: asMemberId(8), lentOn: "2026-11-12", returnedOn: null },
];

test("the open loan says who has the book", () => assert.equal(currentBorrower(asBookId(1), loans), 8));
test("a book never lent has no borrower", () => assert.equal(currentBorrower(asBookId(2), loans), null));
```

Then:

```ts
export function currentBorrower(bookId: BookId, loans: readonly Loan[]): MemberId | null {
  return loans.find((l) => l.bookId === bookId && l.returnedOn === null)?.memberId ?? null;
}
```

Stop here if you are between Part A and Part B of the lesson.

## Step 5 — Two open loans is an error

Two open loans for one book should never happen. Decide it is an error, and return a
`Result` instead of guessing: change the function to return
`{ ok: true; value: MemberId | null } | { ok: false; error: string }`, with a test that two
open loans give `ok: false`.

## Step 6 — An exhaustive switch

```ts
export function canBorrow(status: MemberStatus): boolean {
  switch (status) {
    case "current": return true;
    case "left": return false;
    default: { const never: never = status; return never; }
  }
}
```

Now add `| "suspended"` to `MemberStatus` and run the type check. Expected: an error on the
`const never` line — the compiler shows you the `switch` that forgot the new status. Add the
case, then remove `"suspended"` again.

## Step 7 — A test that must not compile

`tests/library.check.ts`:

```ts
import { asBookId, type Book, type MemberId } from "../src/library.ts";

// @ts-expect-error a book has no borrower: it is derived from the loans
export const b: Book = { id: asBookId(1), title: "Things Fall Apart", borrowerId: 7 as MemberId };
```

Run the type check: no error. `@ts-expect-error` says "the next line must fail". Now delete
`borrowerId: 7 as MemberId, ` and run it again. Expected:
`error TS2578: Unused '@ts-expect-error' directive`. The test caught that the line became
valid. Put it back.

## Step 8 — Check and commit

```bash
npm run typecheck && npm test
```

Commit with a message that names the rule: who has a book is derived from the open loan.

## What you used

`readonly` · literal unions · branded ids · `| null` · `Result` · `never` ·
`@ts-expect-error`
