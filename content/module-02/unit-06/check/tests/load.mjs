// Loads the learner's module src/lib/<name>.ts, or else src/lib/<name>.mjs, from the project
// the checker runs in (ACADEMY_PROJECT). So this check still passes after unit 2.3 turns the
// file into TypeScript.
import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

export async function loadLib(name) {
  const project = process.env.ACADEMY_PROJECT ?? process.cwd();
  for (const ext of [".ts", ".mjs"]) {
    const file = join(project, "src", "lib", `${name}${ext}`);
    if (existsSync(file)) return import(pathToFileURL(file).href);
  }
  throw new Error(`src/lib/${name}.ts or src/lib/${name}.mjs is missing`);
}
