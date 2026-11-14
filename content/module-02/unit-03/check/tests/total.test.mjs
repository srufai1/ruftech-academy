// D-162: CA raw / 60 x 50 + exam / examMax x 50, each to two decimals. D-171: exam out of 140.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLib } from "./load.mjs";

const { calculateTotal } = await loadLib("marks");
const marks = (individual, classTest, group, project, exam) => ({ individual, classTest, group, project, exam });
const numbers = (c) => ({ caRaw: c.caRaw, caScaled: c.caScaled, examScaled: c.examScaled, total: c.total });

test("the worked example: 12, 13.5, 14, 10 and exam 68", () => {
  assert.deepEqual(calculateTotal(marks(12, 13.5, 14, 10, 68)), { caRaw: 49.5, caScaled: 41.25, examScaled: 34, total: 75.25, complete: true, hasAbsence: false });
});
test("all zeros give a total of 0", () => assert.equal(calculateTotal(marks(0, 0, 0, 0, 0)).total, 0));
test("all maxima give a total of 100", () => assert.equal(calculateTotal(marks(15, 15, 15, 15, 100)).total, 100));
test("D-171: 112 out of 140 scales to 40", () => assert.equal(calculateTotal(marks(15, 15, 15, 15, 112), 140).examScaled, 40));
test("decimals: 7.33 four times and exam 33.33", () => {
  assert.deepEqual(numbers(calculateTotal(marks(7.33, 7.33, 7.33, 7.33, 33.33))), { caRaw: 29.32, caScaled: 24.43, examScaled: 16.67, total: 41.1 });
});
test("a part above its maximum is a RangeError", () => assert.throws(() => calculateTotal(marks(16, 0, 0, 0, 0)), RangeError));
test("an exam above examMax is a RangeError", () => assert.throws(() => calculateTotal(marks(0, 0, 0, 0, 101)), RangeError));
