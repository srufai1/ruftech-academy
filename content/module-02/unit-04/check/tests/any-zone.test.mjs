// schoolToday must not depend on the time zone of the computer it runs on.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const loader = fileURLToPath(new URL("./load.mjs", import.meta.url));
const script = `
  const { loadLib } = await import(${JSON.stringify(new URL("./load.mjs", import.meta.url).href)});
  const { schoolToday } = await loadLib("school-date");
  console.log(schoolToday(new Date("2026-12-14T23:30:00Z")), schoolToday(new Date("2026-12-15T02:00:00Z")));
`;
for (const zone of ["Pacific/Kiritimati", "America/Los_Angeles"]) {
  test(`the same answer on a computer set to ${zone}`, () => {
    const run = spawnSync(process.execPath, ["--input-type=module", "-e", script], { env: { ...process.env, TZ: zone }, encoding: "utf8" });
    assert.equal(run.status, 0, run.stderr || loader);
    assert.equal(run.stdout.trim(), "2026-12-14 2026-12-15");
  });
}
