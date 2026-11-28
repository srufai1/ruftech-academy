import { SITE } from "@/config/site";
import type { SupabaseClient } from "@supabase/supabase-js";
import { DeploymentForm } from "./deployment-form";
import { reviewDeployment, submitDeployment } from "./deployment-actions";

type Submission = {
  id: string; address: string; note: string;
  deployment_reviews: { confirmed: boolean; reason: string } | null;
};

export async function Deployments({ project, owner, supabase }: { project: string; owner: boolean; supabase: SupabaseClient }) {
  const { data, error } = await supabase.from("deployment_submissions")
    .select("id, address, note, deployment_reviews(confirmed, reason)").eq("item_slug", project).order("created_at", { ascending: false });
  const submissions = (data ?? []) as unknown as Submission[];
  return <section aria-labelledby="deployed-site" className="space-y-3">
    <h2 id="deployed-site" className="font-semibold">{SITE.deployment.title}</h2>
    {error ? <p role="alert">{SITE.deployment.loadError}</p> : <>
      {!owner && <><p>{SITE.deployment.instructions}</p>
        <DeploymentForm action={submitDeployment.bind(null, project)} /></>}
      {!submissions.length && <p>{SITE.deployment.empty}</p>}
      {submissions.map(s => <article key={s.id} className="min-w-0 space-y-2 rounded-lg border p-3">
        <a href={s.address} className="inline-flex min-h-11 items-center break-all underline" rel="noreferrer">{s.address}</a>
        <p className="break-words">{s.note}</p>
        {s.deployment_reviews ? <p className="break-words">{s.deployment_reviews.confirmed ? SITE.deployment.confirmed : SITE.deployment.declined} · {s.deployment_reviews.reason}</p>
          : <><p>{SITE.deployment.pending}</p>{owner && <DeploymentForm review action={reviewDeployment.bind(null, project, s.id)} />}</>}
      </article>)}
    </>}
  </section>;
}
