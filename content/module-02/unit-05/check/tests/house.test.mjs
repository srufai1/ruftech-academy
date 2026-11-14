// D-70: the House with the fewest students; ties go to the first name alphabetically.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadSrc } from "./load.mjs";

const { assignHouse } = await loadSrc("house");

test("Houses 2 and 3 tie with the fewest: House 2", () => assert.equal(assignHouse({ "House 1": 12, "House 2": 9, "House 3": 9, "House 4": 11 }), "House 2"));
test("all equal: House 1", () => assert.equal(assignHouse({ "House 1": 4, "House 2": 4, "House 3": 4, "House 4": 4 }), "House 1"));
test("keys in another order: still the first name of the fewest", () => assert.equal(assignHouse({ "House 4": 2, "House 3": 2, "House 1": 7, "House 2": 5 }), "House 3"));
