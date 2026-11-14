// addDays and daysBetween work on whole calendar days.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLib } from "./load.mjs";

const { addDays, daysBetween } = await loadLib("school-date");

test("14 days after Christmas 2026 is 8 January 2027", () => assert.equal(addDays("2026-12-25", 14), "2027-01-08"));
test("the day after 28 February 2028 is the 29th", () => assert.equal(addDays("2028-02-28", 1), "2028-02-29"));
test("one day back crosses a year end", () => assert.equal(addDays("2027-01-01", -1), "2026-12-31"));
test("Term 1 (sample) runs 95 days from first day to last day", () => assert.equal(daysBetween("2026-09-14", "2026-12-18"), 95));
test("reversed dates give a negative number", () => assert.equal(daysBetween("2026-12-18", "2026-09-14"), -95));
test("an unreal date gives null", () => { assert.equal(daysBetween("2026-02-30", "2026-03-01"), null); assert.equal(daysBetween("2026-03-01", "nope"), null); });
