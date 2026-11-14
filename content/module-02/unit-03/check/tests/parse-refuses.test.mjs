// parseMark refuses with { ok: false, error } and never throws.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLib } from "./load.mjs";

const { parseMark } = await loadLib("marks");
const BAD = [16, "16", -1, "-1", " -1", 7.255, "7.255", "1e2", "0x10", "12.", ".5", "12abc", "17O", NaN, Infinity, true, [], {}];

for (const bad of BAD) {
  test(`${JSON.stringify(bad) ?? String(bad)} is refused for max 15`, () => {
    let result;
    assert.doesNotThrow(() => { result = parseMark(bad, 15); });
    assert.equal(result.ok, false);
    assert.equal(typeof result.error, "string");
    assert.ok(result.error.length > 0);
  });
}
test("a mark above the maximum names the maximum in its error", () => {
  const result = parseMark("15.01", 15);
  assert.equal(result.ok, false);
  assert.match(result.error, /15/);
});
