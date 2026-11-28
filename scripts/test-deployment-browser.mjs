import assert from "node:assert/strict";
import { renderView } from "./lib/render-view.mjs";
import { noSideways, withPhone } from "./lib/browser.mjs";

await withPhone(async page => {
  for (const review of [false, true]) {
    await page.setContent(await renderView("app/(app)/project/[id]/deployment-form.tsx", "DeploymentForm", { review, action: async () => ({ saved: true }) }));
    if (review) {
      await page.getByRole("combobox", { name: "Decision", exact: true }).selectOption("no");
      await page.getByLabel("Reason for your decision").fill("The practice page is missing.");
    } else {
      await page.getByLabel("HTTPS demo address").fill("https://demo.example.test");
      await page.getByLabel("My demo uses synthetic data only.").check();
      await page.getByLabel("What should the reviewer try?").fill("Open the sample report.");
    }
    assert.ok(await page.locator("form").evaluate(form => form.checkValidity()));
    assert.ok((await page.getByRole("button").boundingBox()).height >= 44);
    assert.ok(await noSideways(page));
  }
});
console.log("Deployment submission and owner decision forms passed at 360px.");
