// D-48: ADM/GPIS/YYYY/NNN, NNN from 001 within the admission year.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadSrc } from "./load.mjs";

const { nextAdmissionNumber } = await loadSrc("admission-number");
const year2026 = Array.from({ length: 150 }, (_, i) => `ADM/GPIS/2026/${String(i + 1).padStart(3, "0")}`);

test("other years do not count: 150 in 2026 and two in 2027 give 2027/003", () => {
  assert.equal(nextAdmissionNumber([...year2026, "ADM/GPIS/2027/001", "ADM/GPIS/2027/002"], 2027), "ADM/GPIS/2027/003");
});
test("the first admission of a year is 001", () => assert.equal(nextAdmissionNumber(year2026, 2027), "ADM/GPIS/2027/001"));
test("the order of the list does not matter", () => assert.equal(nextAdmissionNumber(["ADM/GPIS/2027/007", "ADM/GPIS/2026/200", "ADM/GPIS/2027/003"], 2027), "ADM/GPIS/2027/008"));
test("099 is followed by 100", () => assert.equal(nextAdmissionNumber(["ADM/GPIS/2027/099"], 2027), "ADM/GPIS/2027/100"));
