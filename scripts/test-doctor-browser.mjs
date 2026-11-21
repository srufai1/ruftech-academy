import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { main } from "../packages/checker/src/cli.ts";
import fake from "./fixtures/doctor-playwright.cjs";

const modulePath = fileURLToPath(new URL("./fixtures/doctor-playwright.cjs", import.meta.url));
const original = process.env.GPIS_PLAYWRIGHT_MODULE;
const { fixture } = fake;

async function probe(expected) {
  const lines = [];
  const started = performance.now();
  assert.equal(await main(["doctor"], line => lines.push(line)), 0);
  assert.ok(performance.now() - started < 21_000, "doctor respected the total deadline");
  const browserLines = lines.filter(line => /^  (OK|NEEDS) +browser /.test(line));
  assert.equal(browserLines.length, 1);
  assert.match(browserLines[0], expected);
  assert.deepEqual(lines.slice(-2), ["Ready.", "The browser is needed from module 3."]);
  return browserLines[0];
}

try {
  console.log(await probe(/^  OK      browser  Chromium works \(Playwright \d+\.\d+\.\d+[^,]*, Chromium [\d.]+\)$/));

  process.env.GPIS_PLAYWRIGHT_MODULE = modulePath + ".missing";
  console.log(await probe(/^  NEEDS   browser  Playwright is not installed\. Run: npm install -D playwright$/));

  process.env.GPIS_PLAYWRIGHT_MODULE = modulePath;
  fixture.failAt = "launch";
  fixture.message = "Executable doesn't exist";
  console.log(await probe(/^  NEEDS   browser  Chromium is not installed\. Run: npx playwright install chromium$/));
  assert.deepEqual(fixture.calls.splice(0), ["launch"]);

  fixture.message = "Host system is missing dependencies to run browsers";
  console.log(await probe(/^  NEEDS   browser  Chromium cannot start: a Linux library is missing\. Run: sudo npx playwright install-deps chromium$/));
  assert.deepEqual(fixture.calls.splice(0), ["launch"]);

  fixture.failAt = "";
  await probe(/^  OK      browser  Chromium works/);
  assert.deepEqual(fixture.calls.splice(0), ["launch", "newPage", "about:blank", "page.close", "browser.close"]);

  fixture.failAt = "goto";
  fixture.message = "sensitive diagnostic\nsecond line";
  await probe(/^  NEEDS   browser  Chromium could not open and close a blank page\.$/);
  assert.deepEqual(fixture.calls.splice(0), ["launch", "newPage", "about:blank", "browser.close"]);

  fixture.failAt = "stall";
  await probe(/^  NEEDS   browser  Chromium did not finish the browser check within 20 seconds\.$/);
  assert.deepEqual(fixture.calls.splice(0), ["launch", "newPage", "about:blank", "browser.close"]);
} finally {
  if (original === undefined) delete process.env.GPIS_PLAYWRIGHT_MODULE;
  else process.env.GPIS_PLAYWRIGHT_MODULE = original;
}
console.log("Doctor browser probe: 7 scenarios passed.");
