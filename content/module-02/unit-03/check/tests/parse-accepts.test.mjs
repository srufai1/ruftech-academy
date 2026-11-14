// parseMark accepts: blank -> null, ABS in any case -> "ABS", numbers and digit text 0..max.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLib } from "./load.mjs";

const { parseMark } = await loadLib("marks");
const ok = (input, max, value) => assert.deepEqual(parseMark(input, max), { ok: true, value }, `parseMark(${JSON.stringify(input)}, ${max})`);

for (const max of [15, 100]) {
  test(`blank is null (max ${max})`, () => { for (const b of [null, undefined, "", "   "]) ok(b, max, null); });
  test(`ABS in any case is "ABS" (max ${max})`, () => { for (const a of ["ABS", "abs", " Abs "]) ok(a, max, "ABS"); });
  test(`zero is 0, not blank (max ${max})`, () => { ok(0, max, 0); ok("0", max, 0); });
  test(`the maximum itself is accepted (max ${max})`, () => { ok(max, max, max); ok(String(max), max, max); });
}
test("digit text with up to two decimals, and numbers", () => {
  ok("15", 15, 15); ok("15.00", 15, 15); ok("7.5", 15, 7.5); ok(7.25, 15, 7.25); ok(" 12 ", 15, 12); ok("99.99", 100, 99.99);
});
