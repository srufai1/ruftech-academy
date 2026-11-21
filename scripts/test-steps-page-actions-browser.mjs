import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { main } from "../packages/checker/src/cli.ts";
import { pageStep } from "../packages/checker/src/steps/page.ts";
import { runSteps } from "../packages/checker/src/runner.ts";

const require = createRequire(import.meta.url);
const chromium = require(process.env.GPIS_PLAYWRIGHT_MODULE ?? "playwright").chromium;
const launch = chromium.launch.bind(chromium);
const cwd = process.cwd();
const dir = mkdtempSync(join(tmpdir(), "academy-page-"));
const savedDisplay = process.env.DISPLAY;
let credential = randomUUID();
let foreignHits = 0;
let reloadRequests = 0;
let browser;
const listen = async handler => {
  const server = createServer(handler).listen(0, "127.0.0.1");
  await new Promise(resolve => server.once("listening", resolve));
  return { server, origin: "http://127.0.0.1:" + server.address().port };
};
const foreign = await listen((_, res) => { foreignHits++; res.end("Other app"); });
const app = await listen((req, res) => {
  const path = new URL(req.url, "http://localhost").pathname;
  const redirect = location => { res.writeHead(302, { location }); res.end(); };
  if (path === "/redirect") return redirect("/another-hop");
  if (path === "/another-hop") return redirect(foreign.origin);
  if (path === "/broken" || (path === "/break-reload" && reloadRequests++ > 0)) return req.socket.destroy();
  res.setHeader("content-type", "text/html");
  if (path === "/sign-in") return res.end('<form action="/signed"><label>Practice name<input></label><button>Sign in</button></form>');
  if (path === "/signed") {
    res.setHeader("set-cookie", "practice=" + credential + "; HttpOnly; SameSite=Strict; Path=/");
    return redirect("/protected");
  }
  if (path === "/protected" && req.headers.cookie !== "practice=" + credential) return redirect("/sign-in");
  res.setHeader("content-type", "text/html");
  res.end(`<!doctype html><meta name=viewport content="width=device-width"><title>Practice</title>
    <label>Mark<input data-testid="mark"></label><button>Save</button>
    <a href="/redirect">Other app</a><p data-testid="row">Practice form</p><p data-testid="row" hidden>Hidden row</p>
    <p id="view"></p><script>
    view.textContent=innerWidth+" by "+innerHeight;
    const input=document.querySelector("input");
    input.oninput=()=>{input.setAttribute("aria-invalid",String(input.value==="16"));localStorage.setItem("draft",JSON.stringify({mark:Number(input.value)}))};
    window.onbeforeunload=e=>{if(input.value==="16"){e.preventDefault();e.returnValue=true}};
    document.querySelector("button").onclick=()=>setTimeout(()=>view.textContent="Saved",80);
    </script>`);
});
const ctx = { workDir: dir, checkDir: dir };
const step = fields => ({ id: "form", title: "Practice form", kind: "page", required: true, url: app.origin + "/form", ...fields });
let captured = [];
async function cli(args) {
  captured = [];
  return main(["session", ...args], line => captured.push(line));
}
async function check(fields, outcome, reason) {
  const s = step(fields);
  const result = (await runSteps([s], ctx, { page: pageStep }, { form: "Practice form incomplete." })).steps[0];
  assert.equal(result.outcome, outcome, JSON.stringify(result));
  if (reason) assert.equal(result.reasons.at(-1), reason);
  if (reason?.startsWith("action ")) assert.equal(result.reasons.length, 1);
  return `${result.outcome.toUpperCase()}  ${s.id}${reason ? "  " + result.reasons.at(-1) : ""}`;
}
try {
  process.chdir(dir);
  execFileSync("git", ["init", "-q"]);
  assert.equal(await cli(["admin"]), 1);
  assert.match(captured.join(" "), /\.academy\//);
  writeFileSync(".gitignore", ".academy/\n");
  delete process.env.DISPLAY;
  const wayland = process.env.WAYLAND_DISPLAY;
  delete process.env.WAYLAND_DISPLAY;
  assert.equal(await cli(["admin"]), 1);
  assert.match(captured.join(" "), /WSLg/);
  if (wayland !== undefined) process.env.WAYLAND_DISPLAY = wayland;

  // The command requests a visible window. This harness supplies a real headless
  // Chromium and drives the practice form on the learner's behalf.
  process.env.DISPLAY = ":test";
  let signed;
  chromium.launch = async options => {
    browser = await launch({ ...options, headless: true });
    if (!options.headless) {
      const newContext = browser.newContext.bind(browser);
      browser.newContext = async options => {
        const context = await newContext(options);
        context.once("page", p => {
          signed = (async () => {
            await p.getByLabel("Practice name").fill("ZZ Learner");
            await p.getByRole("button", { name: "Sign in" }).click();
          })();
          signed.catch(() => { void p.close().catch(() => {}); });
        });
        return context;
      };
    }
    return browser;
  };
  assert.equal(await cli(["admin", "--url", app.origin + "/sign-in"]), 0, captured.join(" "));
  await signed;
  assert.deepEqual(captured, ["Saved session for admin. It is private."]);
  const file = ".academy/sessions/admin.json";
  const initial = readFileSync(file);
  assert.equal(statSync(file).mode & 0o777, 0o600);
  assert.equal(statSync(".academy/sessions").mode & 0o777, 0o700);
  assert.equal(await cli([]), 0);
  assert.match(captured.join(" "), /^admin  \d+ min old$/);

  const field = { label: "Mark" };
  console.log(await check({ url: app.origin + "/protected", session: "admin", sign_in_path: "/sign-in", viewport: "computer", actions: [
    { expect_text: "1280 by 800" }, { expect_no_text: "Hidden row" }, { expect_count: { testid: "row", count: 1 } },
    { expect_local_storage: { key: "draft", json: null } }, { fill: { ...field, value: "16" } },
    { expect_attribute: { testid: "mark", name: "aria-invalid", value: "true" } }, { expect_focus: field },
    { expect_local_storage: { key: "draft", json: { mark: 16 } } }, { expect_leave_warning: true },
    { fill: { testid: "mark", value: "12" } }, { expect_leave_warning: false }, { expect_focus: field },
    { press: { key: "Tab" } }, { click: { role: "button", name: "Save" } }, { wait_for: { text: "Saved", seconds: 2 } },
    { goto: "/protected?part=exam&class=3" }, { expect_url: { path: "/protected", query: { part: "exam" } } }, { reload: true },
    { expect_local_storage: { key: "draft", json: { mark: 12 } } },
  ] }, "pass"));
  assert.deepEqual(readFileSync(file), initial);
  console.log(await check({ actions: [{ click: { role: "button", name: "Submit Mathematics" } }] }, "fail",
    'action 1 (click button "Submit Mathematics"): not found'));
  console.log(await check({ session: "teacher" }, "needs", "No saved session for teacher. Run: npx academy session teacher"));
  credential = randomUUID();
  console.log(await check({ url: app.origin + "/protected", session: "admin", sign_in_path: "/sign-in" }, "needs",
    "The saved session for admin has expired. Run: npx academy session admin"));
  console.log(await check({ url: "http://127.0.0.1:1/" }, "needs", "Nothing answered at http://127.0.0.1:1/. Start your app (npm run dev)."));
  await check({ url: app.origin + "/redirect" }, "fail", "left the local app");
  await check({ actions: [{ click: { role: "link", name: "Other app" } }] }, "fail", "left the local app");
  assert.equal(foreignHits, 0);

  for (const [action, reason] of [
    [{ goto: "/broken" }, "goto): did not finish"],
    [{ reload: true }, "reload): did not finish"],
    [{ press: { key: "NotAKey" } }, "press): could not press key"],
    [{ fill: { label: "Absent", value: "private fixture" } }, 'fill label "Absent"): not found or not editable'],
    [{ expect_text: "Missing" }, "expect_text): expected visible text"],
    [{ expect_no_text: "Practice form" }, "expect_no_text): text is still visible"],
    [{ expect_url: { path: "/form", query: { a: "b" } } }, "expect_url): expected path or query did not match"],
    [{ expect_focus: field }, "expect_focus): expected field to have focus"],
    [{ expect_attribute: { ...field, name: "aria-invalid", value: "true" } }, "expect_attribute): expected attribute did not match"],
    [{ expect_count: { testid: "row", count: 2 } }, "expect_count): visible count did not match"],
    [{ expect_local_storage: { key: "draft", json: {} } }, "expect_local_storage): stored JSON did not match"],
    [{ expect_leave_warning: true }, "expect_leave_warning): leave warning did not match"],
    [{ wait_for: { text: "Missing", seconds: 1 } }, "wait_for): expected visible text"],
  ]) {
    await check({ url: app.origin + ("reload" in action ? "/break-reload" : "/form"), actions: [action, { goto: "/never" }] }, "fail", "action 1 (" + reason);
  }
  await check({ timeout_seconds: 1, actions: [{ wait_for: { text: "Missing", seconds: 10 } }] }, "fail", "page step timed out");
  assert.equal(browser.isConnected(), false);
  assert.deepEqual(readFileSync(file), initial);
  assert.equal(await cli(["admin", "--clear"]), 0);
  assert.equal(await cli([]), 0);
  assert.deepEqual(captured, ["No saved sessions."]);
} finally {
  chromium.launch = launch;
  process.chdir(cwd);
  if (savedDisplay === undefined) delete process.env.DISPLAY;
  else process.env.DISPLAY = savedDisplay;
  app.server.close(); foreign.server.close();
  rmSync(dir, { recursive: true, force: true });
}
console.log("Page actions, session lifecycle and browser cleanup passed.");
