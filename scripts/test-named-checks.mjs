import assert from "node:assert/strict";
import { appendFileSync, cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildContent } from "./lib/content-build.mjs";
import { folderHash } from "../packages/shared/src/content-load.ts";
import { loadCheck } from "../packages/checker/src/checks.ts";
import { main } from "../packages/checker/src/cli.ts";

const work = mkdtempSync(join(tmpdir(), "named-checks-"));
const root = join(work, "content");
const source = fileURLToPath(new URL("../content/", import.meta.url));
const unit = join(root, "module-01/unit-01");
const read = file => readFileSync(file, "utf8");
try {
  cpSync(source, root, { recursive: true });
  const original = buildContent(root);
  const metaPath = join(unit, "unit.md");
  const originalMeta = read(metaPath);
  const declare = kinds => writeFileSync(metaPath, originalMeta.replace("---", `---\nextra_checks: [${kinds}]`));
  for (const kind of ["own", "debug"]) {
    const folder = join(unit, `check-${kind}`);
    cpSync(join(unit, "check"), folder, { recursive: true });
    const file = join(folder, "check.yaml");
    writeFileSync(file, read(file).replaceAll("m1-p1", `m1-p1-${kind}`));
  }
  declare("own, debug");
  const { manifest, course, index } = buildContent(root, original.manifest);
  const checks = course.units[0].checks;
  const ids = ["m1-p1", "m1-p1-debug", "m1-p1-own"];
  assert.deepEqual(checks.map(c => c.definition.id), ids);
  assert.equal(course.units[0].hashes.project, original.course.units[0].hashes.project);
  for (const [i, id] of ids.entries()) {
    const hash = folderHash(join(unit, i ? 'check-' + checks[i].kind : 'check'));
    assert.deepEqual(manifest.checks.find(c => c.id === id), { id, version: "1.0.0", sha256: hash, unit: "m1-u1" });
    if (i) {
      const item = index.items.find(item => item.slug === id);
      assert.deepEqual([item.kind, item.parent_slug, item.position, item.content_hash], ["check", ids[0], i, hash]);
    }
  }
  process.env.ACADEMY_CHECKS_DIR = root;
  process.env.HOME = work;
  for (const id of ids) assert.equal(loadCheck(id).id, id);
  assert.throws(() => loadCheck("m1-p1-other"), e => ids.every(id => e.message.includes(id)));
  const lines = [];
  const run = (...args) => main(args, s => lines.push(s), s => lines.push(s));
  assert.equal(await run("init", ids[1]), 0);
  assert.equal(await run("check", ids[1], "--dry-run"), 1);
  assert.ok(lines.some(line => line.includes("NOT PASSED") && line.includes(ids[1])));

  declare("debug");
  assert.throws(() => buildContent(root), /extra_checks is missing "own"/);
  declare("own, debug, docker");
  assert.throws(() => buildContent(root), /check-docker: folder is missing/);
  declare("debug, own");
  mkdirSync(join(unit, "check-other"));
  assert.throws(() => buildContent(root), /check-other: unknown check folder/);
  rmSync(join(unit, "check-other"), { recursive: true });
  const file = join(unit, "check-own/check.yaml");
  const yaml = read(file);
  writeFileSync(file, yaml.replace("unit: m1-u1", "unit: m1-u2"));
  assert.throws(() => buildContent(root), /check-own\/check.yaml: unit is "m1-u2"/);
  writeFileSync(file, yaml.replace("id: m1-p1-own", "id: m1-p1-debug"));
  assert.throws(() => buildContent(root), /id "m1-p1-debug" is already used/);
  writeFileSync(file, yaml);
  appendFileSync(file, "\n");
  assert.throws(() => buildContent(root, manifest), /check-own\/check.yaml:.*changed but version/);

  const dockerDir = join(unit, "check-docker");
  cpSync(join(unit, "check-own"), dockerDir, { recursive: true });
  writeFileSync(join(dockerDir, "check.yaml"), yaml.replaceAll("m1-p1-own", "m1-p1-docker"));
  declare("docker, own, debug");
  const docker = buildContent(root).index.items.find(item => item.slug === "m1-p1-docker");
  assert.equal(docker.position, 3);
  assert.equal(loadCheck(docker.slug).dir, dockerDir);
} finally {
  rmSync(work, { recursive: true, force: true });
}
console.log("Named checks: content, hashes, manifest, CLI and validation passed.");
