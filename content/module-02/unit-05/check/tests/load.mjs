// Loads src/<name>.ts from the lab folder the checker runs in (ACADEMY_PROJECT).
import { join } from "node:path";
import { pathToFileURL } from "node:url";

export async function loadSrc(name) {
  const project = process.env.ACADEMY_PROJECT ?? process.cwd();
  return import(pathToFileURL(join(project, "src", `${name}.ts`)).href);
}
