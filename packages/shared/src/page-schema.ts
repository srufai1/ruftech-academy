/** The small declarative language accepted in course page checks. */
type Field = { label: string } | { testid: string };
export type Target = Field | { role: string; name: string };
export type PageAction =
  | { goto: string } | { reload: true } | { fill: Field & { value: string } }
  | { click: Target } | { press: { key: string } }
  | { expect_text: string } | { expect_no_text: string }
  | { expect_url: { path: string; query?: Record<string, string> } }
  | { expect_focus: Field } | { expect_attribute: Field & { name: string; value: string } }
  | { expect_count: { testid: string; count: number } }
  | { expect_local_storage: { key: string; json: unknown } }
  | { expect_leave_warning: boolean } | { wait_for: { text: string; seconds: number } };

type Obj = Record<string, unknown>;
const object = (v: unknown): v is Obj => v !== null && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === "string" && !!v.trim();
const integer = (v: unknown, min: number, max: number) => Number.isInteger(v) && Number(v) >= min && Number(v) <= max;
export const sessionRole = (v: unknown): v is string => typeof v === "string" && v.length <= 30 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v);
const keys = (v: Obj, ...names: string[]) => Object.keys(v).length === names.length && names.every(n => Object.hasOwn(v, n));
const field = (v: Obj, ...extra: string[]) => (keys(v, "label", ...extra) && text(v.label)) || (keys(v, "testid", ...extra) && text(v.testid));

function path(v: unknown, query = false) {
  return typeof v === "string" && v.startsWith("/") && !v.startsWith("//") && !/[\\#\u0000-\u001f]/.test(v) && (query || !v.includes("?"));
}

export function localAppUrl(v: unknown): URL | null {
  if (typeof v !== "string") return null;
  try {
    const url = new URL(v);
    return url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname)
      && !url.username && !url.password ? url : null;
  } catch { return null; }
}

function json(v: unknown, ancestors = new Set<object>()): boolean {
  if (v === null || typeof v === "boolean" || typeof v === "string" || Number.isFinite(v)) return true;
  if (typeof v !== "object" || ancestors.has(v)) return false;
  ancestors.add(v);
  const valid = Object.values(v).every(item => json(item, ancestors));
  ancestors.delete(v);
  return valid;
}

function validAction(action: unknown): boolean {
  if (!object(action) || Object.keys(action).length !== 1) return false;
  const [name, v] = Object.entries(action)[0]!;
  switch (name) {
    case "goto": return path(v, true);
    case "reload": return v === true;
    case "expect_text": case "expect_no_text": return text(v);
    case "expect_leave_warning": return typeof v === "boolean";
  }
  if (!object(v)) return false;
  switch (name) {
    case "fill": return field(v, "value") && typeof v.value === "string";
    case "click": return field(v) || (keys(v, "role", "name") && text(v.role) && text(v.name));
    case "press": return keys(v, "key") && text(v.key);
    case "expect_url": return path(v.path) && (keys(v, "path") || (keys(v, "path", "query") && object(v.query) && Object.values(v.query).every(s => typeof s === "string")));
    case "expect_focus": return field(v);
    case "expect_attribute": return field(v, "name", "value") && text(v.name) && typeof v.value === "string";
    case "expect_count": return keys(v, "testid", "count") && text(v.testid) && Number.isSafeInteger(v.count) && Number(v.count) >= 0;
    case "expect_local_storage": return keys(v, "key", "json") && text(v.key) && json(v.json);
    case "wait_for": return keys(v, "text", "seconds") && text(v.text) && integer(v.seconds, 1, 10);
    default: return false;
  }
}

export function validatePageStep(step: Obj): string[] {
  const problems: string[] = [];
  if (!localAppUrl(step.url)) problems.push("a page step needs a local HTTP URL");
  if ("session" in step && !sessionRole(step.session)) problems.push("invalid session role");
  if ("sign_in_path" in step && !path(step.sign_in_path)) problems.push("invalid sign_in_path");
  if ("media" in step && step.media !== "print") problems.push("media must be print");
  if ("viewport" in step && step.viewport !== "phone" && step.viewport !== "computer") problems.push("invalid viewport");
  if ("timeout_seconds" in step && !integer(step.timeout_seconds, 1, 120)) problems.push("timeout_seconds must be 1 to 120");
  if ("actions" in step) {
    if (!Array.isArray(step.actions) || step.actions.length > 40) problems.push("actions must be a list of at most 40");
    else step.actions.forEach((a, i) => { if (!validAction(a)) problems.push(`invalid page action ${i + 1}`); });
  }
  return problems;
}
