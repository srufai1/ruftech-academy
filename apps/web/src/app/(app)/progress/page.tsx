import type { SupabaseClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import { PageError } from "@/components/page-error";
import { ProgressView } from "@/components/views/progress-view";
import { requireLearner } from "@/lib/auth/learner";
import { getCourse } from "@/lib/content/load";
import { courseOutline } from "@/lib/content/outline";
import { projectFacts, type ProgressRow, type ReviewRow, type RunRow } from "@/lib/progress/facts";
import { nextItem } from "@/lib/progress/summary";

export const metadata: Metadata = { title: "Progress" };

type RunJoin = { id: number; passed: boolean; check_definitions: { item_slug: string; version: string } | null };

// Keyset pages keep a frequently run extra check from hiding another check's history.
async function progressRuns(supabase: SupabaseClient): Promise<RunJoin[] | null> {
  const rows: RunJoin[] = [];
  let before: number | undefined;
  while (true) {
    let query = supabase.from("check_runs").select("id, passed, check_definitions(item_slug, version)").order("id", { ascending: false }).limit(500);
    if (before !== undefined) query = query.lt("id", before);
    const { data, error } = await query;
    if (error) return null;
    const page = data as unknown as RunJoin[];
    rows.push(...page);
    if (!page.length) return rows;
    before = page[page.length - 1]!.id;
  }
}

export default async function ProgressPage() {
  const { supabase } = await requireLearner();
  const [progress, runs, reviews] = await Promise.all([
    supabase.from("progress").select("item_slug, state, due_on, updated_at").limit(5000),
    progressRuns(supabase),
    supabase.from("reviews").select("item_slug").limit(5000),
  ]);
  if (progress.error || !runs || reviews.error) return <PageError />;

  const rows = (progress.data ?? []) as ProgressRow[];
  const runRows: RunRow[] = runs
    .filter((r) => r.check_definitions)
    .map((r) => ({ item_slug: r.check_definitions!.item_slug, version: r.check_definitions!.version, passed: r.passed }));
  const reviewRows = (reviews.data ?? []) as ReviewRow[];
  const now = new Date();
  const outline = courseOutline();
  const units = new Map(getCourse().units.map(u => [u.check.id, u]));

  const modules = outline.filter((m) => m.units.length > 0).map((m) => ({
    slug: m.slug, title: m.title, label: m.label,
    projects: m.units.map(u => {
      const unit = units.get(u.projectId)!;
      const extras = unit.checks.flatMap(({ kind, definition }) => kind === "main" ? [] : [{ kind, id: definition.id, version: definition.version }]);
      return projectFacts({ slug: u.projectId, label: u.label, title: u.projectTitle, currentVersion: unit.check.version, extras }, rows, runRows, reviewRows, now);
    }),
  }));
  const state = Object.fromEntries(rows.map((r) => [r.item_slug, r.state]));
  const next = nextItem(outline, state);
  return (
    <ProgressView
      modules={modules}
      projectsDone={rows.filter((r) => r.state === "done" && outline.some((m) => m.units.some((u) => u.projectId === r.item_slug))).length}
      quizzesPassed={rows.filter((r) => r.state === "quiz_passed").length}
      next={next ? { href: next.href, label: `${next.label} ${next.title}` } : null}
    />
  );
}
