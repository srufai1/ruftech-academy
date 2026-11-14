// The nine tests the repository started with: what worked must still work.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadSrc } from "./load.mjs";

const { nextAdmissionNumber } = await loadSrc("admission-number");
const { splitFullName } = await loadSrc("full-name");
const { assignHouse } = await loadSrc("house");

test("the first number ever is 001", () => assert.equal(nextAdmissionNumber([], 2027), "ADM/GPIS/2027/001"));
test("the next number follows the last", () => assert.equal(nextAdmissionNumber(["ADM/GPIS/2027/001"], 2027), "ADM/GPIS/2027/002"));
test("codes in another shape are ignored", () => assert.equal(nextAdmissionNumber(["GPIS-7", "ADM/GPIS/2027/004"], 2027), "ADM/GPIS/2027/005"));
test("two words: first and last name", () => assert.deepEqual(splitFullName("Ama Birikran"), { firstName: "Ama", lastName: "Birikran" }));
test("three words: the rest is the last name", () => assert.deepEqual(splitFullName("Ama Serwaa Birikran"), { firstName: "Ama", lastName: "Serwaa Birikran" }));
test("one word is an error", () => assert.ok("error" in splitFullName("Ama")));
test("the House with the fewest students", () => assert.equal(assignHouse({ "House 1": 3, "House 2": 1, "House 3": 2, "House 4": 5 }), "House 2"));
test("the fewest may be the last House", () => assert.equal(assignHouse({ "House 1": 5, "House 2": 5, "House 3": 5, "House 4": 1 }), "House 4"));
test("no Houses is an error", () => assert.throws(() => assignHouse({}), RangeError));
