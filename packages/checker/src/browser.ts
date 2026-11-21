import { createRequire } from "node:module";
import { join } from "node:path";

export type Browser = { version(): string; newPage(o?: object): Promise<Page>; close(): Promise<void> };
type Page = {
  goto(url: string, o: object): Promise<{ status(): number } | null>;
  close(): Promise<void>;
  title(): Promise<string>;
  evaluate<T>(fn: (arg: number) => T, arg: number): Promise<T>;
  getByText(t: string): { first(): { isVisible(): Promise<boolean> } };
};

type Chromium = { launch(options?: { headless: boolean; timeout: number }): Promise<Browser> };

/** Prefer the learner's project, then the installed checker. */
export function loadChromium(projectDir: string): { chromium: Chromium; version: string } | null {
  const name = process.env.GPIS_PLAYWRIGHT_MODULE ?? "playwright";
  for (const from of [join(projectDir, "package.json"), import.meta.url]) {
    const req = createRequire(from);
    try {
      const { chromium } = req(name);
      if (!chromium) continue;
      let version = "unknown";
      try {
        const entry = createRequire(req.resolve(name));
        version = entry("./package.json").version ?? version;
      } catch { /* A module override can be a standalone fixture. */ }
      return { chromium, version };
    } catch { /* Try the checker if the project cannot load Playwright. */ }
  }
  return null;
}
