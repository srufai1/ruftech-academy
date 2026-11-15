// D-20 and D-21: a term belongs to exactly one membership of a student.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLib } from "./load.mjs";
import { MEMBERSHIPS, T1, T2 } from "./roll-fixture.mjs";

const { membershipForTerm } = await loadLib("membership");

test("Ama in Term 1 is in the 3A membership", () => assert.equal(membershipForTerm(MEMBERSHIPS, 1, T1)?.id, 101));
test("Ama in Term 2 is in the 3B membership", () => assert.equal(membershipForTerm(MEMBERSHIPS, 1, T2)?.id, 102));
test("a term of another year gives null", () => assert.equal(membershipForTerm(MEMBERSHIPS, 1, 99), null));
test("two memberships naming one term is refused", () => {
  assert.throws(() => membershipForTerm([...MEMBERSHIPS, { ...MEMBERSHIPS[0], id: 198 }], 1, T1));
});
