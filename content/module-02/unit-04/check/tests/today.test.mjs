// "Today at the school" is the calendar date in Africa/Accra.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLib } from "./load.mjs";

const { schoolToday, SCHOOL_TIME_ZONE } = await loadLib("school-date");

test("SCHOOL_TIME_ZONE is Africa/Accra", () => assert.equal(SCHOOL_TIME_ZONE, "Africa/Accra"));
test("one second before midnight is still the 14th", () => assert.equal(schoolToday(new Date("2026-12-14T23:59:59Z")), "2026-12-14"));
test("midnight starts the 15th", () => assert.equal(schoolToday(new Date("2026-12-15T00:00:00Z")), "2026-12-15"));
test("23:30 in New York on the 14th is already the 15th in Accra", () => assert.equal(schoolToday(new Date("2026-12-14T23:30:00-05:00")), "2026-12-15"));
