// A total outside 0-100 is a RangeError; a value that is not a number is a TypeError.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLib } from "./load.mjs";

const { remarkFor } = await loadLib("grading");

for (const bad of [-1, -0.01, 100.01, 101, NaN, Infinity]) {
  test(`${bad} is refused with RangeError`, () => assert.throws(() => remarkFor(bad), RangeError));
}
for (const [name, bad] of [['"80"', "80"], ["null", null], ["undefined", undefined], ["true", true], ["[80]", [80]]]) {
  test(`${name} is refused with TypeError`, () => assert.throws(() => remarkFor(bad), TypeError));
}
