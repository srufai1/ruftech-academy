// D-162 and D-10: blank and ABS never become 0; a total exists only when every part is a number.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLib } from "./load.mjs";

const { calculateTotal } = await loadLib("marks");
const marks = (individual, classTest, group, project, exam) => ({ individual, classTest, group, project, exam });

test("one blank part: no total, not complete", () => {
  const c = calculateTotal(marks(12, 13, null, 10, 68));
  assert.equal(c.total, null); assert.equal(c.complete, false); assert.equal(c.hasAbsence, false); assert.equal(c.caRaw, null);
});
test("a blank exam: the CA is still worked out, no total", () => {
  const c = calculateTotal(marks(15, 15, 15, 15, null));
  assert.equal(c.caScaled, 50); assert.equal(c.examScaled, null); assert.equal(c.total, null); assert.equal(c.complete, false);
});
test("one ABS: no total, complete, with an absence", () => {
  const c = calculateTotal(marks(12, "ABS", 14, 10, 68));
  assert.equal(c.total, null); assert.equal(c.complete, true); assert.equal(c.hasAbsence, true);
});
test("all blank: every number is null", () => {
  const c = calculateTotal(marks(null, null, null, null, null));
  assert.deepEqual([c.caRaw, c.caScaled, c.examScaled, c.total, c.complete, c.hasAbsence], [null, null, null, null, false, false]);
});
