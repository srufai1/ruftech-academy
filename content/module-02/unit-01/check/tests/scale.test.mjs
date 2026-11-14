// D-01: the remark scale, Creche to JHS 2. A band starts AT its lower number.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLib } from "./load.mjs";

const { remarkFor } = await loadLib("grading");
const SCALE = [
  [80, 100, "Highest"], [70, 79, "Higher"], [65, 69, "High"], [60, 64, "High Average"],
  [55, 59, "Average"], [50, 54, "Low Average"], [45, 49, "Low"], [40, 44, "Lower"], [0, 39, "Lowest"],
];

for (const [low, high, label] of SCALE) {
  test(`${low} to ${high} is ${label}`, () => {
    for (let total = low; total <= high; total++) assert.equal(remarkFor(total), label, `remarkFor(${total})`);
  });
}

test("both sides of the eight inner edges", () => {
  for (let i = 0; i < SCALE.length - 1; i++) {
    const [low, , label] = SCALE[i];
    const below = SCALE[i + 1][2];
    assert.equal(remarkFor(low), label, `remarkFor(${low})`);
    assert.equal(remarkFor(low - 1), below, `remarkFor(${low - 1})`);
  }
});

test("decimals: a band starts at its lower number", () => {
  assert.equal(remarkFor(79.5), "Higher");
  assert.equal(remarkFor(64.99), "High Average");
  assert.equal(remarkFor(39.999), "Lowest");
  assert.equal(remarkFor(0.5), "Lowest");
});
