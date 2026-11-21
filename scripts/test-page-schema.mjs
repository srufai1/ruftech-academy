import assert from "node:assert/strict";
import { validateCheck } from "../packages/shared/src/content-schema.ts";

const base = { id: "page", title: "Page", kind: "page", required: true, url: "http://localhost:3000/" };
const errors = fields => validateCheck({ id: "p", title: "Page", version: "1.0.0", unit: "u", steps: [{ ...base, ...fields }] });
assert.deepEqual(errors({}), []);
assert.deepEqual(errors({ session: "practice-admin", viewport: "computer", timeout_seconds: 120, sign_in_path: "/sign-in",
  actions: [{ goto: "/work?part=exam" }, { fill: { label: "Mark", value: "" } },
    { click: { role: "button", name: "Save" } }, { expect_local_storage: { key: "draft", json: { a: [1, null] } } }] }), []);
for (const fields of [
  { actions: [{ javascript: "1" }] }, { actions: [{ goto: "/one", reload: true }] },
  { actions: [{ click: { selector: ".button" } }] }, { actions: [{ click: { xpath: "//input" } }] },
  { actions: [{ fill: { label: "Name", testid: "name", value: "" } }] },
  { actions: [{ goto: "//other" }] }, { actions: [{ goto: "https://other.test" }] }, { actions: [{ goto: "/\\other" }] },
  { actions: Array(41).fill({ reload: true }) }, { viewport: "tablet" }, { viewport: ["phone"] }, { timeout_seconds: 121 },
  { timeout_seconds: 0 }, { session: "../admin" }, { session: "a".repeat(31) }, { sign_in_path: "//other" },
  { actions: [{ expect_count: { testid: "row", count: -1 } }] }, { actions: [{ wait_for: { text: "Go", seconds: 11 } }] },
  { actions: [{ expect_url: { path: "/", query: { a: 1 } } }] }, { actions: [{ reload: false }] },
]) assert.ok(errors(fields).length, JSON.stringify(fields));
console.log("Page schema: valid legacy and interactive steps accepted, invalid fields refused.");
