// termFor: both ends of a term are included; between terms there is none.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLib } from "./load.mjs";

const { termFor } = await loadLib("school-date");
const TERMS = [
  { name: "Term 1", startsOn: "2026-09-14", endsOn: "2026-12-18" },
  { name: "Term 2", startsOn: "2027-01-11", endsOn: "2027-04-01" },
  { name: "Term 3", startsOn: "2027-04-26", endsOn: "2027-07-29" },
];
const nameOn = (date, terms = TERMS) => termFor(date, terms)?.name ?? null;

test("first day, last day and a middle day of each term", () => {
  for (const t of TERMS) { assert.equal(nameOn(t.startsOn), t.name); assert.equal(nameOn(t.endsOn), t.name); }
  assert.equal(nameOn("2026-10-30"), "Term 1"); assert.equal(nameOn("2027-02-15"), "Term 2"); assert.equal(nameOn("2027-06-01"), "Term 3");
});
test("the holidays between terms belong to no term", () => { assert.equal(nameOn("2026-12-19"), null); assert.equal(nameOn("2027-04-10"), null); });
test("an unreal date is a RangeError", () => assert.throws(() => termFor("2026-02-30", TERMS), RangeError));
test("overlapping terms are a RangeError", () => {
  const overlap = [TERMS[0], { name: "Bad", startsOn: "2026-12-18", endsOn: "2027-01-05" }];
  assert.throws(() => termFor("2026-10-01", overlap), RangeError);
});
test("the terms array is not changed", () => {
  const frozen = Object.freeze(TERMS.map((t) => Object.freeze({ ...t })).reverse());
  assert.equal(nameOn("2027-02-15", frozen), "Term 2");
});
