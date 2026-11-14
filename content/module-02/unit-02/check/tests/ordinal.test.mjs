// ordinal: the position word printed on the report card.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLib } from "./load.mjs";

const { ordinal } = await loadLib("ranking");
const WORDS = [[1, "1st"], [2, "2nd"], [3, "3rd"], [4, "4th"], [11, "11th"], [12, "12th"], [13, "13th"], [21, "21st"], [22, "22nd"], [101, "101st"], [111, "111th"]];

for (const [n, word] of WORDS) test(`${n} is ${word}`, () => assert.equal(ordinal(n), word));
for (const [name, bad] of [["0", 0], ["-1", -1], ["1.5", 1.5], ['"1"', "1"]]) {
  test(`${name} is refused`, () => assert.throws(() => ordinal(bad)));
}
