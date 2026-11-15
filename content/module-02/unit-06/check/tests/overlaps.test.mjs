import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLib } from "./load.mjs";

const { overlaps } = await loadLib("membership");
const p = (startedOn, endedOn) => ({ id: 1, studentId: 1, classId: 1, academicYearId: 1, startedOn, endedOn, termIds: [] });
const both = (a, b, expected, name) => test(name, () => { assert.equal(overlaps(a, b), expected); assert.equal(overlaps(b, a), expected, "the answer must not depend on the order"); });

both(p("2026-09-14", "2026-12-18"), p("2027-01-11", "2027-04-01"), false, "one before the other");
both(p("2026-09-14", "2026-12-18"), p("2026-12-18", "2027-04-01"), true, "touching on the same day");
both(p("2026-09-14", "2027-07-29"), p("2026-11-01", "2026-11-30"), true, "one inside the other");
both(p("2026-09-14", "2026-12-18"), p("2026-09-14", "2026-12-18"), true, "equal periods");
both(p("2026-09-14", null), p("2027-01-11", "2027-04-01"), true, "an open membership against a later one");
both(p("2027-01-11", null), p("2026-09-14", "2026-12-18"), false, "an open membership against an earlier, ended one");
