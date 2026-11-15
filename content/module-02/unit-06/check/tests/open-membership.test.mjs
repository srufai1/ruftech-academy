import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLib } from "./load.mjs";
import { MEMBERSHIPS } from "./roll-fixture.mjs";

const { openMembership } = await loadLib("membership");

test("no membership: ok, null", () => assert.deepEqual(openMembership([], 1), { ok: true, value: null }));
test("one open membership is returned", () => { const r = openMembership(MEMBERSHIPS, 1); assert.equal(r.ok, true); assert.equal(r.value.id, 102); });
test("ended memberships only: ok, null", () => assert.deepEqual(openMembership(MEMBERSHIPS, 2), { ok: true, value: null }));
test("two open memberships are an error result", () => {
  const two = [...MEMBERSHIPS, { ...MEMBERSHIPS[1], id: 199, classId: 1 }];
  const r = openMembership(two, 1);
  assert.equal(r.ok, false); assert.equal(typeof r.error, "string");
});
