import { localAppUrl, validatePageStep, type PageAction } from "@ruftech-academy/shared/content-schema";
import { browserProblem, loadChromium, missingPlaywright, type Browser } from "../browser.ts";
import { readSession } from "../commands/session.ts";
import { CheckerError } from "../errors.ts";
import { guardLocalPage } from "../local-page.ts";
import { cleanReason, type StepKindImpl, type StepOutput } from "../runner.ts";
import { runAction } from "./page-actions.ts";

type Expect = { status?: number; title_contains?: string; text?: string[]; no_sideways_scroll?: boolean; min_target_px?: number };
const needs = (reason: string): StepOutput => ({ outcome: "needs", reasons: [cleanReason(reason)] });
const fail = (reason: string): StepOutput => ({ outcome: "fail", reasons: [cleanReason(reason)] });

export const pageStep: StepKindImpl = async (step, ctx) => {
  const problems = validatePageStep(step);
  if (problems.length) throw new CheckerError(problems.join("; "));
  const parsed = localAppUrl(step.url)!;
  const url = step.url as string;
  const e = (step.expect ?? {}) as Expect;
  const timeout = Number(step.timeout_seconds ?? 60) * 1000;
  const pw = loadChromium(ctx.workDir);
  if (!pw) return needs(missingPlaywright);
  const role = step.session as string | undefined;
  const storageState = role ? readSession(ctx.workDir, role, parsed.origin) : undefined;
  if (role && !storageState) return needs(`No saved session for ${role}. Run: npx academy session ${role}`);

  let browser: Browser | undefined;
  let finished = false;
  let stop!: (output: StepOutput) => void;
  const interrupted = new Promise<StepOutput>(resolve => { stop = resolve; });
  const timer = setTimeout(() => stop(fail("page step timed out")), timeout);
  const run = async (): Promise<StepOutput> => {
    try { browser = await pw.chromium.launch({ headless: true, timeout }); }
    catch (error) { return needs(browserProblem(error)); }
    // A slow launch can return after the deadline, before the outer finally saw a browser.
    if (finished) { await browser.close(); return fail("page step timed out"); }
    const viewport = step.viewport === "computer" ? { width: 1280, height: 800 } : { width: 360, height: 780 };
    const context = await browser.newContext({ viewport, storageState, serviceWorkers: "block" });
    const page = await context.newPage();
    const probe = await guardLocalPage(context, page, parsed.origin, () => stop(fail("left the local app")), step.media === "print");
    let response;
    try { response = await page.goto(url, { waitUntil: "load", timeout: Math.min(timeout, 20000) }); }
    catch { return needs(`Nothing answered at ${url}. Start your app (npm run dev).`); }
    if (role && new URL(page.url()).pathname === (step.sign_in_path ?? "/login"))
      return needs(`The saved session for ${role} has expired. Run: npx academy session ${role}`);
    const actions = (step.actions ?? []) as PageAction[];
    for (const [index, action] of actions.entries()) {
      const reason = await runAction(page, action, index + 1, parsed.origin, probe);
      if (reason) return { ...fail(reason), onlyOwnReason: true };
    }
    const reasons: string[] = [];
    const status = response?.status() ?? 0;
    if (status !== (e.status ?? 200)) reasons.push(`${url} answered ${status}, expected ${e.status ?? 200}`);
    if (e.title_contains && !(await page.title()).includes(e.title_contains)) reasons.push(`the page title does not contain "${e.title_contains}"`);
    for (const t of e.text ?? []) if (!(await page.getByText(t).first().isVisible().catch(() => false))) reasons.push(`"${t}" is not visible on the page`);
    if (e.no_sideways_scroll !== false && await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth, 0)) reasons.push("the page scrolls sideways at 360px");
    if (e.min_target_px) {
      const small = await page.evaluate(({ min, privatePage }) => [...document.querySelectorAll("a, button, input, select, summary")]
        .filter((el) => el.getClientRects().length && el.getBoundingClientRect().height < min)
        .map(el => privatePage ? el.tagName.toLowerCase() : (el.textContent || el.getAttribute("aria-label") || el.tagName).trim().slice(0, 30)), { min: e.min_target_px, privatePage: !!role || actions.length > 0 });
      if (small.length) reasons.push(`tap targets under ${e.min_target_px}px: ${small.slice(0, 3).join(", ")}`);
    }
    return { outcome: reasons.length ? "fail" : "pass", reasons: reasons.slice(0, 5).map(cleanReason) };
  };
  try {
    return await Promise.race([run(), interrupted]);
  } catch {
    return fail("could not inspect the local page");
  } finally {
    finished = true;
    clearTimeout(timer);
    await browser?.close();
  }
};
