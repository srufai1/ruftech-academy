import Link from "next/link";
import type { Section } from "@/lib/content/sections";

import { CopyCommand } from "@/components/copy-command";
import { Results, type ShownRun } from "@/app/(app)/project/[id]/results";
import { SITE } from "@/config/site";

export type ProjectViewProps = {
  moduleHref: string;
  moduleLabel: string;
  label: string;
  title: string;
  guidanceLabel: string;
  introHtml: string;
  task: { heading: string; html: string }[];
  steps: { count: number; html: string } | null;
  hints: { count: number; html: string } | null;
  debuggingHtml: string;
  ownBuildHtml: string;
  checks: { id: string; kind: keyof typeof SITE.checkLabels; runs: ShownRun[] }[];
  passedNow: boolean;
  /** The link to the self-review (T22), given by the page. */
  review: React.ReactNode;
};

/** Project task page (mockup 04), with the checker results the CLI sent (T20). */
export function ProjectView(p: ProjectViewProps) {
  return (
    <article className="mx-auto w-full min-w-0 max-w-3xl space-y-8">
      <header className="space-y-1">
        <Link href={p.moduleHref} className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground">‹ {p.moduleLabel}</Link>
        <h1 className="text-xl font-semibold">{p.label} {p.title}</h1>
        <p className="text-sm text-muted-foreground">Project · {p.guidanceLabel}</p>
      </header>

      <section aria-label="Task" className="md space-y-4">
        <div dangerouslySetInnerHTML={{ __html: p.introHtml }} />
        {p.task.map((s) => (
          <div key={s.heading} className="space-y-4">
            <h2>{s.heading}</h2>
            <div dangerouslySetInnerHTML={{ __html: s.html }} />
          </div>
        ))}
      </section>

      {p.steps || p.hints ? (
        <div className="space-y-2">
          {p.steps ? <Fold title={`Steps (${p.steps.count})`} html={p.steps.html} /> : null}
          {p.hints ? <Fold title={`Hints (${p.hints.count})`} html={p.hints.html} /> : null}
        </div>
      ) : null}

      {p.checks.map(({ id, kind, runs }) => (
        <section key={id} aria-labelledby={`run-${id}`} className="space-y-2">
          <h2 id={`run-${id}`} className="font-semibold">{p.checks.length === 1 ? "Run in your terminal" : SITE.checkLabels[kind]}</h2>
          <CopyCommand command={`npx academy check ${id}`} quiet={p.passedNow || kind !== "main"} />
          <h3 className="font-semibold">Last result</h3>
          <Results runs={runs} />
        </section>
      ))}

      <section aria-labelledby="after-pass" className="space-y-2">
        <h2 id="after-pass" className="font-semibold">After a pass</h2>
        {p.review}
      </section>

      <div className="space-y-2">
        <Fold title="Debugging lab" html={p.debuggingHtml} />
        <Fold title="Own build" html={p.ownBuildHtml} />
      </div>
    </article>
  );
}

function Fold({ title, html }: { title: string; html: string }) {
  return (
    <details className="rounded-xl border bg-card px-4 shadow-sm">
      <summary className="flex min-h-11 cursor-pointer items-center font-medium">{title}</summary>
      <div className="md pb-4" dangerouslySetInnerHTML={{ __html: html }} />
    </details>
  );
}

export type { Section };
