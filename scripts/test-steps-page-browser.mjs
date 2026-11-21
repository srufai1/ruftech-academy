/** T16: the page step against a small local page: what fits at 360px, tap targets, and the localhost-only rule. */
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import fake from "./fixtures/doctor-playwright.cjs";
import { createServer } from "node:http";
import { pageStep } from "../packages/checker/src/steps/page.ts";
import { CheckerError } from "../packages/checker/src/errors.ts";

const pages = {
  "/good": `<!doctype html><meta name="viewport" content="width=device-width"><title>GPIS · Students</title><body style="margin:0"><h1>Students</h1><a href="#" style="display:block;min-height:44px">Admit</a></body>`,
  "/wide": `<!doctype html><meta name="viewport" content="width=device-width"><title>Wide</title><body><table style="width:900px"><tr><td>x</td></tr></table><a href="#">tiny</a></body>`,
};
const server = createServer((req, res) => {
  const body = pages[req.url];
  res.writeHead(body ? 200 : 404, { "content-type": "text/html" });
  res.end(body ?? "not found");
}).listen(0, "127.0.0.1");
await new Promise((r) => server.once("listening", r));
const base = `http://127.0.0.1:${server.address().port}`;
const ctx = { workDir: process.cwd(), checkDir: process.cwd() };
const step = (url, expect = {}) => ({ id: "p", kind: "page", title: "P", required: true, url, expect });
let n = 0;
const eq = (a, b, label) => { assert.deepEqual(a, b, label); n++; };

try {
  eq(await pageStep(step(`${base}/good`, { title_contains: "Students", text: ["Admit"], min_target_px: 44 }), ctx), { outcome: "pass", reasons: [] }, "a good page passes");
  const wide = await pageStep(step(`${base}/wide`, { min_target_px: 44 }), ctx);
  eq(wide.outcome, "fail");
  assert.ok(wide.reasons.includes("the page scrolls sideways at 360px"), "sideways scroll is caught"); n++;
  assert.ok(wide.reasons.some((r) => r.startsWith("tap targets under 44px: tiny")), "a small tap target is caught"); n++;
  eq((await pageStep(step(`${base}/missing`), ctx)).reasons, [`${base}/missing answered 404, expected 200`]);
  eq((await pageStep(step(`${base}/good`, { text: ["Delete everything"] }), ctx)).reasons, ['"Delete everything" is not visible on the page']);
  eq(await pageStep(step("http://127.0.0.1:1/"), ctx), { outcome: "needs", reasons: ["Nothing answered at http://127.0.0.1:1/. Start your app (npm run dev)."] });
  const original = process.env.GPIS_PLAYWRIGHT_MODULE;
  const fixture = fileURLToPath(new URL("./fixtures/doctor-playwright.cjs", import.meta.url));
  try {
    process.env.GPIS_PLAYWRIGHT_MODULE = fixture + ".missing";
    eq(await pageStep(step(base), ctx), { outcome: "needs", reasons: ["Playwright is not installed. Run: npm install -D playwright"] });
    process.env.GPIS_PLAYWRIGHT_MODULE = fixture;
    fake.fixture.failAt = "launch";
    fake.fixture.message = "Executable doesn't exist";
    eq(await pageStep(step(base), ctx), { outcome: "needs", reasons: ["Chromium is not installed. Run: npx playwright install chromium"] });
    fake.fixture.message = "Host system is missing dependencies";
    eq(await pageStep(step(base), ctx), { outcome: "needs", reasons: ["Chromium cannot start: a Linux library is missing. Run: sudo npx playwright install-deps chromium"] });
  } finally {
    if (original === undefined) delete process.env.GPIS_PLAYWRIGHT_MODULE;
    else process.env.GPIS_PLAYWRIGHT_MODULE = original;
  }
  for (const url of ["https://example.com/", "http://192.168.1.5/", "file:///etc/passwd"]) {
    await assert.rejects(pageStep(step(url), ctx), CheckerError, url); n++;
  }
} finally {
  server.close();
}
console.log(`Step page: ${n} checks passed.`);
