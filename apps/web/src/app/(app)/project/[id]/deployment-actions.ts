"use server";

import { SITE } from "@/config/site";
import { revalidatePath } from "next/cache";
import { requireLearner } from "@/lib/auth/learner";
import { deploymentProjects, isDeploymentAddress } from "@/lib/reviews/deployment";

export type DeploymentState = { error?: string; saved?: boolean };

export async function submitDeployment(project: string, _state: DeploymentState, form: FormData): Promise<DeploymentState> {
  const { supabase } = await requireLearner();
  const address = String(form.get("address") ?? "").trim();
  const note = String(form.get("note") ?? "").trim();
  if (!deploymentProjects.includes(project) || !isDeploymentAddress(address) || !note || note.length > 1000 || form.get("synthetic") !== "on") {
    return { error: SITE.deployment.invalidSubmission };
  }
  const { error } = await supabase.from("deployment_submissions").insert({ item_slug: project, address, note });
  if (error) return { error: SITE.deployment.submitError };
  revalidatePath(`/project/${project}`);
  return { saved: true };
}

export async function reviewDeployment(project: string, id: string, _state: DeploymentState, form: FormData): Promise<DeploymentState> {
  const { claims, supabase } = await requireLearner();
  const verdict = form.get("verdict");
  const reason = String(form.get("reason") ?? "").trim();
  if (claims.app_metadata?.role !== "owner" || !deploymentProjects.includes(project) ||
      !reason || reason.length > 1000 || (verdict !== "yes" && verdict !== "no")) return { error: SITE.deployment.invalidReview };
  const { data } = await supabase.from("deployment_submissions").select("id").eq("item_slug", project).eq("id", id).maybeSingle();
  if (!data) return { error: SITE.deployment.missing };
  const { error } = await supabase.from("deployment_reviews").insert({ submission_id: id, confirmed: verdict === "yes", reason });
  if (error) return { error: error.code === "23505" ? SITE.deployment.duplicate : SITE.deployment.reviewError };
  revalidatePath(`/project/${project}`);
  return { saved: true };
}
