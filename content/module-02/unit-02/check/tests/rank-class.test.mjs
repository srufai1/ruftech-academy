// rankClass: D-02 positions, Q-07 missing subjects, D-04 active students only, input order kept.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLib } from "./load.mjs";

const { rankClass } = await loadLib("ranking");
const CLASS = [
  { id: "s1", status: "active", subjects: [70, 80] },
  { id: "s2", status: "withdrawn", subjects: [100, 100] },
  { id: "s3", status: "active", subjects: [75, 75] },
  { id: "s4", status: "active", subjects: [60, null, 70] },
  { id: "s5", status: "alumni", subjects: [99, 99] },
  { id: "s6", status: "active", subjects: [50.25, 50.5] },
];
const EXPECTED = [
  { id: "s1", total: 150, position: 1, ordinal: "1st" },
  { id: "s3", total: 150, position: 1, ordinal: "1st" },
  { id: "s4", total: 130, position: 3, ordinal: "3rd" },
  { id: "s6", total: 100.75, position: 4, ordinal: "4th" },
];
const rows = (list) => rankClass(list).map(({ id, total, position, ordinal }) => ({ id, total, position, ordinal }));

test("active students only, ties shared, a missing subject adds nothing, input order kept", () => {
  assert.deepEqual(rows(CLASS), EXPECTED);
});
test("D-04: a withdrawn student moves nobody's position", () => {
  assert.deepEqual(rows(CLASS.filter((s) => s.id !== "s2")), EXPECTED);
});
