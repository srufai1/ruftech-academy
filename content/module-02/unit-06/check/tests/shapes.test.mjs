// Compiles fixtures/shapes.check.ts against the learner's types with the project's own tsc,
// in a temporary folder. Nothing is written into the project.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const project = process.env.ACADEMY_PROJECT ?? process.cwd();

test("the school types refuse wrong data and accept right data", () => {
  const tsc = join(project, "node_modules", ".bin", "tsc");
  assert.ok(existsSync(tsc), "TypeScript is not installed in the project (node_modules/.bin/tsc)");
  const dir = mkdtempSync(join(tmpdir(), "m2-p6-shapes-"));
  try {
    const fixture = readFileSync(new URL("../fixtures/shapes.check.ts", import.meta.url), "utf8")
      .replaceAll("__TYPES__", join(project, "src", "lib", "school-types.ts"))
      .replaceAll("__MARKS__", join(project, "src", "lib", "marks.ts"));
    writeFileSync(join(dir, "shapes.check.ts"), fixture);
    writeFileSync(join(dir, "tsconfig.json"), JSON.stringify({
      extends: join(project, "tsconfig.json"),
      compilerOptions: { types: [], noEmit: true },
      include: [], files: [join(dir, "shapes.check.ts")],
    }));
    const run = spawnSync(tsc, ["--noEmit", "-p", join(dir, "tsconfig.json")], { encoding: "utf8" });
    assert.equal(run.status, 0, (run.stdout + run.stderr).replaceAll(dir, "<check>").slice(0, 1500));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
