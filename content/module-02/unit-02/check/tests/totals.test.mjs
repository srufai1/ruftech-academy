// Q-07: a missing subject (null) adds nothing; the total is rounded to two decimals.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLib } from "./load.mjs";

const { subjectsTotal } = await loadLib("ranking");

test("a null subject adds nothing", () => assert.equal(subjectsTotal([80, null, 70]), 150));
test("0.1 + 0.2 is 0.3", () => assert.equal(subjectsTotal([0.1, 0.2]), 0.3));
test("no subjects gives 0", () => assert.equal(subjectsTotal([]), 0));
test("only nulls gives 0", () => assert.equal(subjectsTotal([null, null]), 0));
test("the total is rounded to two decimals", () => assert.equal(subjectsTotal([33.335, 33.335]), 66.67));
