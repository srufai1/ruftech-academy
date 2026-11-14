// D-02: standard competition ranking, positions returned in the input's order.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLib } from "./load.mjs";

const { competitionRanks } = await loadLib("ranking");

test("D-02: 90, 90, 80 gives 1, 1, 3", () => assert.deepEqual(competitionRanks([90, 90, 80]), [1, 1, 3]));
test("D-02: 75, 70, 70, 65 gives 1, 2, 2, 4", () => assert.deepEqual(competitionRanks([75, 70, 70, 65]), [1, 2, 2, 4]));
test("an empty class gives no positions", () => assert.deepEqual(competitionRanks([]), []));
test("one student is 1st", () => assert.deepEqual(competitionRanks([42]), [1]));
test("five equal totals all share 1st", () => assert.deepEqual(competitionRanks([70, 70, 70, 70, 70]), [1, 1, 1, 1, 1]));
test("unsorted input keeps its order", () => assert.deepEqual(competitionRanks([64, 91, 64, 77, 91, 91]), [5, 1, 5, 4, 1, 1]));
test("decimals are compared exactly", () => assert.deepEqual(competitionRanks([70.25, 70.25, 70.2]), [1, 1, 3]));
test("the array it was given is not changed", () => {
  const totals = Object.freeze([64, 91, 77]);
  assert.deepEqual(competitionRanks(totals), [3, 1, 2]);
  assert.deepEqual([...totals], [64, 91, 77]);
});
