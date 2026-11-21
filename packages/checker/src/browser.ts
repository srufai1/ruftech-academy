import { createRequire } from "node:module";
import { join } from "node:path";

// Playwright is installed by the learner. Describe only the API used by the checker.
export type Browser = {
  version(): string;
  newPage(o?: object): Promise<Page>;
  newContext(o: object): Promise<BrowserContext>;
  close(): Promise<void>;
};
export type BrowserContext = {
  newPage(): Promise<Page>;
  newCDPSession(page: Page): Promise<CDPSession>;
  storageState(): Promise<{ cookies: unknown[]; origins: { origin: string }[] }>;
  route(pattern: string, handler: (route: Route) => Promise<void>): Promise<void>;
  on(event: "page", listener: (page: Page) => void): void;
};
type Route = {
  request(): { url(): string; isNavigationRequest(): boolean };
  abort(): Promise<void>;
  continue(): Promise<void>;
};
type CDPSession = {
  send(method: string, params?: object): Promise<unknown>;
  on(event: "Fetch.requestPaused", listener: (event: { requestId: string; request: { url: string } }) => void): void;
};
export type Locator = {
  first(): Locator;
  filter(o: { visible: boolean }): Locator;
  count(): Promise<number>;
  click(o: object): Promise<void>;
  fill(value: string, o: object): Promise<void>;
  isVisible(): Promise<boolean>;
  evaluate<T>(fn: (el: Element) => T, arg: undefined, o: object): Promise<T>;
  getAttribute(name: string, o: object): Promise<string | null>;
};
export type Page = {
  url(): string;
  goto(url: string, o: object): Promise<{ status(): number } | null>;
  reload(o: object): Promise<{ status(): number } | null>;
  close(): Promise<void>;
  title(): Promise<string>;
  evaluate<T, A>(fn: (arg: A) => T, arg: A): Promise<T>;
  getByText(t: string): Locator;
  getByLabel(t: string, o: object): Locator;
  getByTestId(t: string): Locator;
  getByRole(t: string, o: object): Locator;
  keyboard: { press(key: string): Promise<void> };
  waitForURL(predicate: (url: URL) => boolean, o: object): Promise<void>;
  on(event: "dialog", listener: (dialog: Dialog) => void): void;
  off(event: "dialog", listener: (dialog: Dialog) => void): void;
  on(event: "framenavigated", listener: (frame: { url(): string }) => void): void;
  once(event: "close", listener: () => void): void;
};
export type Dialog = { type(): string; dismiss(): Promise<void> };

export const missingPlaywright = "Playwright is not installed. Run: npm install -D playwright";

export function browserProblem(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (/host system is missing dependencies|error while loading shared libraries|cannot open shared object file/i.test(message))
    return "Chromium cannot start: a Linux library is missing. Run: sudo npx playwright install-deps chromium";
  if (/executable doesn't exist/i.test(message))
    return "Chromium is not installed. Run: npx playwright install chromium";
  return "Chromium could not open and close a blank page.";
}

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
