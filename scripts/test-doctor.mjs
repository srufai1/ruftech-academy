import assert from "node:assert/strict";
import { printDoctorLines } from "../packages/checker/src/commands/doctor.ts";

const browser = { name: "browser", ok: false, required: false, detail: "Chromium is missing." };
const node = { name: "node", ok: true, required: true, detail: "v24" };
const lines = [];
assert.equal(printDoctorLines([node, browser], line => lines.push(line)), 0);
assert.deepEqual(lines, [
  "  OK      node     v24",
  "  NEEDS   browser  Chromium is missing.",
  "Ready.",
  "The browser is needed from module 3.",
]);

lines.length = 0;
assert.equal(printDoctorLines([{ ...node, ok: false }, { ...browser, ok: true }], line => lines.push(line)), 1);
assert.match(lines[0], /^  MISSING node /);
assert.match(lines[1], /^  OK      browser /);
assert.match(lines[2], /^Not ready yet: fix the MISSING lines/);
assert.equal(lines[3], "The browser is needed from module 3.");
console.log("Doctor formatting and exit codes passed.");
