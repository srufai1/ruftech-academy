import { setTimeout as delay } from "node:timers/promises";
import { isDeepStrictEqual } from "node:util";
import type { PageAction, Target } from "@ruftech-academy/shared/content-schema";
import type { Page } from "../browser.ts";
import { leaveWarning } from "../local-page.ts";
import { cleanReason } from "../runner.ts";

function locate(page: Page, target: Target) {
  if ("label" in target) return page.getByLabel(target.label, { exact: true });
  if ("testid" in target) return page.getByTestId(target.testid);
  return page.getByRole(target.role, { name: target.name, exact: true });
}

function describe(target: Target) {
  if ("label" in target) return `label "${target.label}"`;
  if ("testid" in target) return `testid "${target.testid}"`;
  return `${target.role} "${target.name}"`;
}

async function until(check: () => Promise<boolean> | boolean, end: number) {
  do {
    if (await check()) return;
    await delay(Math.min(75, Math.max(0, end - Date.now())));
  } while (Date.now() < end);
  throw new Error("assertion timed out");
}

/** Only course-authored action descriptions enter the result. Browser errors can contain form values. */
export async function runAction(page: Page, action: PageAction, number: number, origin: string, probe: string): Promise<string | null> {
  const limit = "wait_for" in action ? action.wait_for.seconds * 1000 : 5000;
  const end = Date.now() + limit;
  const options = { timeout: limit };
  let description = Object.keys(action)[0]!;
  let reason = "did not finish";
  const visible = (text: string) => page.getByText(text).filter({ visible: true }).count();
  const run = async () => {
    if ("goto" in action) { await page.goto(new URL(action.goto, origin).href, options); }
    else if ("reload" in action) { await page.reload(options); }
    else if ("fill" in action) {
      description += " " + describe(action.fill); reason = "not found or not editable";
      await locate(page, action.fill).fill(action.fill.value, options);
    } else if ("click" in action) {
      description += " " + describe(action.click); reason = "not found";
      await locate(page, action.click).click(options);
    } else if ("press" in action) {
      reason = "could not press key"; await page.keyboard.press(action.press.key);
    } else if ("expect_text" in action || "wait_for" in action) {
      reason = "expected visible text";
      const text = "expect_text" in action ? action.expect_text : action.wait_for.text;
      await until(async () => await visible(text) > 0, end);
    } else if ("expect_no_text" in action) {
      reason = "text is still visible";
      await until(async () => await visible(action.expect_no_text) === 0, end);
    } else if ("expect_url" in action) {
      reason = "expected path or query did not match";
      await until(() => {
        const url = new URL(page.url());
        return url.origin === origin && url.pathname === action.expect_url.path &&
          Object.entries(action.expect_url.query ?? {}).every(([key, value]) =>
            url.searchParams.getAll(key).length === 1 && url.searchParams.get(key) === value);
      }, end);
    } else if ("expect_focus" in action) {
      reason = "expected field to have focus";
      const field = locate(page, action.expect_focus);
      await until(() => field.evaluate(el => el.ownerDocument.activeElement === el, undefined, options), end);
    } else if ("expect_attribute" in action) {
      reason = "expected attribute did not match";
      const field = locate(page, action.expect_attribute);
      await until(async () => await field.getAttribute(action.expect_attribute.name, options) === action.expect_attribute.value, end);
    } else if ("expect_count" in action) {
      reason = "visible count did not match";
      const matches = page.getByTestId(action.expect_count.testid).filter({ visible: true });
      await until(async () => await matches.count() === action.expect_count.count, end);
    } else if ("expect_local_storage" in action) {
      reason = "stored JSON did not match";
      const { key, json } = action.expect_local_storage;
      await until(async () => {
        const raw = await page.evaluate(k => localStorage.getItem(k), key);
        if (raw === null || json === null) return raw === null && json === null;
        try { return isDeepStrictEqual(JSON.parse(raw), json); } catch { return false; }
      }, end);
    } else if ("expect_leave_warning" in action) {
      reason = "leave warning did not match";
      await until(async () => await leaveWarning(page, probe, Math.max(1, end - Date.now())) === action.expect_leave_warning, end);
    }
  };
  let timer: NodeJS.Timeout | undefined;
  try {
    await Promise.race([run(), new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error("timeout")), limit); })]);
    return null;
  } catch {
    return cleanReason(`action ${number} (${description}): ${reason}`);
  } finally { clearTimeout(timer); }
}
