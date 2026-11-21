import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, readdirSync, readFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { localAppUrl, sessionRole } from "@ruftech-academy/shared/content-schema";
import { browserProblem, loadChromium, missingPlaywright, type Browser } from "../browser.ts";
import { CheckerError } from "../errors.ts";
import { guardLocalPage } from "../local-page.ts";
import { writeSecretJson } from "../secret-file.ts";

function sessionDirectory(dir: string) {
  const academy = join(dir, ".academy");
  const sessions = join(academy, "sessions");
  for (const path of [academy, sessions]) {
    const stat = lstatSync(path, { throwIfNoEntry: false });
    if (stat && !stat.isDirectory()) throw new CheckerError("The project session folder must be a directory, not a link.");
  }
  return sessions;
}

export function savedSessions(dir: string) {
  const path = sessionDirectory(dir);
  if (!existsSync(path)) return [];
  return readdirSync(path, { withFileTypes: true }).filter(entry =>
    entry.isFile() && entry.name.endsWith(".json") && sessionRole(entry.name.slice(0, -5))
  ).map(entry => ({
    role: entry.name.slice(0, -5), ageMinutes: Math.max(0, Math.floor((Date.now() - lstatSync(join(path, entry.name)).mtimeMs) / 60000)),
  })).sort((a, b) => a.role.localeCompare(b.role));
}

function sessionFile(dir: string, role: string) {
  if (!sessionRole(role)) throw new CheckerError("Use a lowercase role slug of at most 30 characters.");
  return join(sessionDirectory(dir), role + ".json");
}

export function readSession(dir: string, role: string, origin: string) {
  const path = sessionFile(dir, role);
  const stat = lstatSync(path, { throwIfNoEntry: false });
  if (!stat?.isFile() || (stat.mode & 0o077)) return null;
  try {
    const state = JSON.parse(readFileSync(path, "utf8"));
    if (state.academyOrigin !== origin || !Array.isArray(state.cookies) || !Array.isArray(state.origins)) return null;
    return { cookies: state.cookies, origins: state.origins };
  } catch { return null; }
}

export async function session(args: string[], print: (line: string) => void): Promise<number> {
  const dir = process.cwd();
  if (!args.length) {
    const roles = savedSessions(dir);
    for (const { role, ageMinutes } of roles) print(`${role}  ${ageMinutes} min old`);
    if (!roles.length) print("No saved sessions.");
    return 0;
  }
  const [role, ...flags] = args;
  if (!sessionRole(role)) { print("Use a lowercase role slug of at most 30 characters."); return 1; }
  const path = sessionFile(dir, role);
  if (flags.length === 1 && flags[0] === "--clear") {
    if (lstatSync(path, { throwIfNoEntry: false })) unlinkSync(path);
    print(`Cleared session for ${role}.`);
    return 0;
  }
  const rawUrl = flags.length === 0 ? "http://localhost:3000/login" :
    flags.length === 2 && flags[0] === "--url" ? flags[1] :
    flags.length === 1 && flags[0]?.startsWith("--url=") ? flags[0].slice(6) : null;
  const url = localAppUrl(rawUrl);
  if (!url) { print("Use --url with an HTTP sign-in address on localhost or 127.0.0.1."); return 1; }
  const ignored = (file: string) => spawnSync("git", ["check-ignore", "-q", "--", file], { cwd: dir }).status === 0;
  if (!ignored(".academy/x") || !ignored(`.academy/sessions/${role}.json`)) {
    print("Add this line to the project's .gitignore: .academy/");
    return 1;
  }
  if (!process.env.DISPLAY && !process.env.WAYLAND_DISPLAY) {
    print("A visible display is needed. Start WSLg and try again.");
    return 1;
  }
  const pw = loadChromium(dir);
  if (!pw) { print(missingPlaywright); return 1; }
  let browser: Browser;
  try { browser = await pw.chromium.launch({ headless: false, timeout: 20000 }); }
  catch (error) {
    print(/display|x server/i.test(String(error)) ? "A visible display is needed. Start WSLg and try again." : browserProblem(error));
    return 1;
  }
  const input = createInterface({ input: process.stdin });
  try {
    const context = await browser.newContext({ serviceWorkers: "block" });
    const page = await context.newPage();
    let left = false;
    const stopped = new Promise<never>((_, reject) => {
      page.once("close", () => reject(new Error("closed")));
    });
    const capture = async () => {
      await guardLocalPage(context, page, url.origin, () => { left = true; void browser.close().catch(() => {}); });
      await page.goto(url.href, { waitUntil: "domcontentloaded", timeout: 20000 });
      await Promise.race([
        page.waitForURL(next => next.origin === url.origin && next.pathname !== url.pathname, { timeout: 0, waitUntil: "domcontentloaded" }),
        new Promise<void>(resolve => input.once("line", () => resolve())),
      ]);
      if (left || new URL(page.url()).origin !== url.origin) return false;
      const state = await context.storageState();
      if (left) return false;
      writeSecretJson(path, { ...state, academyOrigin: url.origin });
      return true;
    };
    if (!await Promise.race([capture(), stopped])) return 1;
    print(`Saved session for ${role}. It is private.`);
    return 0;
  } catch {
    print("Session was not saved. Keep the sign-in window open on the local app.");
    return 1;
  } finally {
    input.close();
    await browser.close();
  }
}
