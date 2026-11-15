// D-04: membership for that class and term AND status active; last name, then first name.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLib } from "./load.mjs";
import { STUDENTS, MEMBERSHIPS, A, B, T1, T2 } from "./roll-fixture.mjs";

const { classRoll } = await loadLib("membership");
const ids = (classId, termId) => classRoll(STUDENTS, MEMBERSHIPS, classId, termId).map((s) => s.id);

test("Basic 3A in Term 1", () => assert.deepEqual(ids(A, T1), [7, 5, 1]));
test("Basic 3B in Term 2", () => assert.deepEqual(ids(B, T2), [1, 4]));
test("Basic 3A in Term 2", () => assert.deepEqual(ids(A, T2), [7, 5, 8]));
test("a withdrawn pupil with a wrongly open membership is not on the roll", () => assert.ok(!ids(A, T2).includes(3)));
test("the inputs are not changed", () => {
  const before = JSON.stringify([STUDENTS, MEMBERSHIPS]);
  classRoll(STUDENTS, MEMBERSHIPS, A, T1);
  assert.equal(JSON.stringify([STUDENTS, MEMBERSHIPS]), before);
});
