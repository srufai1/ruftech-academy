// After the move to TypeScript, grading (m2-p1) and ranking (m2-p2) behave as before.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLib } from "./load.mjs";

const { remarkFor } = await loadLib("grading");
const { competitionRanks, rankClass } = await loadLib("ranking");

test("D-01 edges still hold", () => { assert.equal(remarkFor(80), "Highest"); assert.equal(remarkFor(79.5), "Higher"); assert.equal(remarkFor(39.999), "Lowest"); });
test("D-01 refusals still hold", () => { assert.throws(() => remarkFor(101), RangeError); assert.throws(() => remarkFor("80"), TypeError); });
test("D-02 positions still hold", () => assert.deepEqual(competitionRanks([75, 70, 70, 65]), [1, 2, 2, 4]));
test("D-04 and Q-07 still hold", () => {
  const rows = rankClass([
    { id: "a", status: "withdrawn", subjects: [100] },
    { id: "b", status: "active", subjects: [60, null] },
    { id: "c", status: "active", subjects: [50] },
  ]).map(({ id, total, position }) => ({ id, total, position }));
  assert.deepEqual(rows, [{ id: "b", total: 60, position: 1 }, { id: "c", total: 50, position: 2 }]);
});
