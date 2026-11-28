import assert from "node:assert/strict";
import { renderView } from "./lib/render-view.mjs";
import { noSideways, withPhone } from "./lib/browser.mjs";
import { projectFacts } from "../apps/web/src/lib/progress/facts.ts";

const slug = "m1-p1";
const version = "1.0.0";
const checks = ["main", "debug", "own"].map(kind => ({
  kind, id: kind === "main" ? slug : slug + "-" + kind, version,
  runs: kind === "own" ? [] : [{ id: 1, passed: kind === "main", currentVersion: true, version, when: "Today", steps: [] }],
}));
await withPhone(async page => {
  await page.setContent(await renderView("components/views/project-view.tsx", "ProjectView", { checks, task: [], title: "Practice" }));
  for (const [i, label] of ["Main check", "Debugging lab", "Own build"].entries()) {
    const block = page.getByRole("region", { name: label, exact: true });
    assert.ok(await block.getByText(["Passed", "Not passed", "No result yet. Run the command in your terminal."][i], { exact: true }).isVisible());
    const copy = block.getByRole("button", { name: "Copy: npx academy check " + checks[i].id });
    assert.ok((await copy.boundingBox()).height >= 44);
  }
  assert.ok(await noSideways(page));

  const ref = { slug, title: "Practice", label: "1.1", currentVersion: version, extras: [...checks.slice(1), { kind: "docker", id: slug + "-docker", version }] };
  const runs = [ { item_slug: slug, version, passed: true }, { item_slug: checks[1].id, version, passed: false },
    { item_slug: checks[1].id, version, passed: true } ];
  const facts = projectFacts(ref, [], runs, [], new Date());
  await page.setContent(await renderView("components/views/progress-view.tsx", "ProgressView", {
    modules: [{ slug: "m1", title: "Practice", label: "1", projects: [facts] }], projectsDone: 0, quizzesPassed: 0, next: null,
  }));
  for (const text of ["not started", "checker passed", "Debugging lab · not passed", "Own build · not yet", "Docker · not yet"]) {
    assert.equal(await page.getByText(text, { exact: true }).count(), 1);
  }
  assert.ok(await noSideways(page));
});
console.log("Named checks at 360px: three project blocks and independent progress results passed.");
