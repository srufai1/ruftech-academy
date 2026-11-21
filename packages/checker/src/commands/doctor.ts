import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { loadChromium, type Browser } from "../browser.ts";

export type DoctorLine = { name: string; ok: boolean; detail: string; required: boolean };

const run = (cmd: string, args: string[]) => spawnSync(cmd, args, { encoding: "utf8", timeout: 5000 });

/** What this computer needs for the course: Linux (WSL 2 on Windows), Node 22.18+, Git, bash. */
function systemLines(): DoctorLine[] {
  const lines: DoctorLine[] = [];
  const proc = existsSync("/proc/version") ? readFileSync("/proc/version", "utf8") : "";
  const wsl = /microsoft/i.test(proc);
  lines.push({ name: "system", ok: process.platform === "linux", required: true,
    detail: process.platform === "linux" ? (wsl ? "WSL 2 (Ubuntu)" : "Linux") : `${process.platform}: open the VS Code terminal inside WSL 2 (Ubuntu)` });
  const [major = 0, minor = 0] = process.versions.node.split(".").map(Number);
  const nodeOk = major > 22 || (major === 22 && minor >= 18);
  lines.push({ name: "node", ok: nodeOk, required: true, detail: nodeOk ? `v${process.versions.node}` : `v${process.versions.node}: install Node 22.18 or later` });
  const git = run("git", ["--version"]);
  lines.push({ name: "git", ok: git.status === 0, required: true, detail: git.status === 0 ? git.stdout.trim() : "not found: sudo apt install git" });
  const bash = run("bash", ["--version"]);
  lines.push({ name: "bash", ok: bash.status === 0, required: true, detail: bash.status === 0 ? (bash.stdout.split("\n")[0] ?? "bash") : "not found" });
  return lines;
}

const BROWSER_TIMEOUT_MS = 20_000;

async function browserLine(): Promise<DoctorLine> {
  const needs = (detail: string): DoctorLine => ({ name: "browser", ok: false, required: false, detail });
  const playwright = loadChromium(process.cwd());
  if (!playwright) return needs("Playwright is not installed. Run: npm install -D playwright");

  const { chromium, version } = playwright;
  let browser: Browser | undefined;
  let expired = false;
  let timer: NodeJS.Timeout;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      expired = true;
      reject(new Error("Browser probe timed out"));
    }, BROWSER_TIMEOUT_MS);
  });

  // Take ownership once, including when the deadline and normal cleanup coincide.
  function closeBrowser() {
    const running = browser;
    browser = undefined;
    return running?.close();
  }

  async function inspect(): Promise<DoctorLine> {
    browser = await chromium.launch({ headless: true, timeout: BROWSER_TIMEOUT_MS });
    try {
      if (expired) throw new Error("Browser probe timed out");
      const chromiumVersion = browser.version();
      const page = await browser.newPage();
      await page.goto("about:blank", { timeout: BROWSER_TIMEOUT_MS });
      await page.close();
      return { name: "browser", ok: true, required: false,
        detail: `Chromium works (Playwright ${version}, Chromium ${chromiumVersion})` };
    } finally {
      await closeBrowser();
    }
  }

  try {
    return await Promise.race([inspect(), timeout]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/host system is missing dependencies|error while loading shared libraries|cannot open shared object file/i.test(message))
      return needs("Chromium cannot start: a Linux library is missing. Run: sudo npx playwright install-deps chromium");
    if (/executable doesn't exist/i.test(message))
      return needs("Chromium is not installed. Run: npx playwright install chromium");
    if (expired || /timeout|timed out/i.test(message)) return needs("Chromium did not finish the browser check within 20 seconds.");
    return needs("Chromium could not open and close a blank page.");
  } finally {
    clearTimeout(timer!);
    if (expired) void closeBrowser()?.catch(() => {});
  }
}

export async function doctorLines(): Promise<DoctorLine[]> {
  return [...systemLines(), await browserLine()];
}

export function printDoctorLines(lines: DoctorLine[], print: (line: string) => void): number {
  for (const line of lines) {
    const status = line.ok ? "OK" : line.required ? "MISSING" : "NEEDS";
    print(`  ${status.padEnd(7)} ${line.name.padEnd(8)} ${line.detail}`);
  }
  const ready = lines.every((line) => line.ok || !line.required);
  print(ready ? "Ready." : "Not ready yet: fix the MISSING lines above, then run npx academy doctor again.");
  print("The browser is needed from module 3.");
  return ready ? 0 : 1;
}

export async function doctor(print: (line: string) => void): Promise<number> {
  return printDoctorLines(await doctorLines(), print);
}
