// isIsoCalendarDate: true only for a real date written YYYY-MM-DD.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLib } from "./load.mjs";

const { isIsoCalendarDate } = await loadLib("school-date");

for (const good of ["2026-12-14", "2028-02-29", "2000-02-29"]) test(`${good} is a real date`, () => assert.equal(isIsoCalendarDate(good), true));
for (const bad of ["2026-02-30", "2027-02-29", "1900-02-29", "2026-13-01", "2026-4-5", "14/12/2026", "", "2026-12-14T00:00"]) {
  test(`"${bad}" is not`, () => assert.equal(isIsoCalendarDate(bad), false));
}
