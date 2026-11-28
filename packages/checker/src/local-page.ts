import { randomUUID } from "node:crypto";
import type { BrowserContext, Dialog, Page } from "./browser.ts";

/** Chromium pauses Document requests here, including every hop of a server redirect.
 * Playwright's route handler alone sees only the first request of a redirect chain.
 */
export async function guardLocalPage(context: BrowserContext, page: Page, origin: string, onLeave: () => void, print = false) {
  const probeUrl = new URL(`/.academy-leave-probe/${randomUUID()}`, origin).href;
  const cdp = await context.newCDPSession(page);
  // Set media on the attached session so its state survives the first navigation.
  if (print) await cdp.send("Emulation.setEmulatedMedia", { media: "print" });
  cdp.on("Fetch.requestPaused", ({ requestId, request }) => {
    let command: Promise<unknown>;
    if (new URL(request.url).origin !== origin) {
      onLeave();
      command = cdp.send("Fetch.failRequest", { requestId, errorReason: "BlockedByClient" });
    } else if (request.url === probeUrl) {
      // A 204 navigation keeps the current document, focus, history and unsaved form.
      command = cdp.send("Fetch.fulfillRequest", { requestId, responseCode: 204 });
    } else command = cdp.send("Fetch.continueRequest", { requestId });
    void command.catch(() => {}); // The owner may already have closed the browser.
  });
  await cdp.send("Fetch.enable", { patterns: [{ resourceType: "Document", requestStage: "Request" }] });
  page.on("framenavigated", frame => {
    if (frame.url() !== "about:blank" && new URL(frame.url()).origin !== origin) onLeave();
  });
  // Also guard the first navigation of new windows before their page event arrives.
  await context.route("**/*", async route => {
    const req = route.request();
    if (req.isNavigationRequest() && new URL(req.url()).origin !== origin) {
      onLeave();
      await route.abort().catch(() => {});
    } else await route.continue().catch(() => {});
  });
  context.on("page", popup => {
    if (popup !== page) {
      popup.on("framenavigated", frame => {
        if (frame.url() !== "about:blank" && new URL(frame.url()).origin !== origin) onLeave();
      });
    }
  });
  return probeUrl;
}

export async function leaveWarning(page: Page, probeUrl: string, timeout: number): Promise<boolean> {
  let warned = false;
  const dismiss = (dialog: Dialog) => {
    warned = dialog.type() === "beforeunload";
    void dialog.dismiss().catch(() => {});
  };
  page.on("dialog", dismiss);
  try {
    await page.goto(probeUrl, { timeout, waitUntil: "commit" }).catch(error => {
      // Both a dismissed leave dialog and a 204 result cancel navigation.
      if (!(error instanceof Error && error.message.includes("ERR_ABORTED"))) throw error;
    });
    return warned;
  } finally {
    page.off("dialog", dismiss);
  }
}
