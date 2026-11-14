// REMARK_BANDS: nine { low, label } objects, highest band first.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLib } from "./load.mjs";

const { REMARK_BANDS } = await loadLib("grading");

test("REMARK_BANDS is an array of nine bands", () => {
  assert.ok(Array.isArray(REMARK_BANDS));
  assert.equal(REMARK_BANDS.length, 9);
});
test("the first band is 80 Highest, the last is 0 Lowest", () => {
  assert.deepEqual({ low: REMARK_BANDS[0].low, label: REMARK_BANDS[0].label }, { low: 80, label: "Highest" });
  assert.deepEqual({ low: REMARK_BANDS[8].low, label: REMARK_BANDS[8].label }, { low: 0, label: "Lowest" });
});
test("the lower numbers fall strictly from the first band to the last", () => {
  for (let i = 1; i < REMARK_BANDS.length; i++) assert.ok(REMARK_BANDS[i].low < REMARK_BANDS[i - 1].low, `band ${i}`);
});
