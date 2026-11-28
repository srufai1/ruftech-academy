"use client";

import { SITE } from "@/config/site";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import type { DeploymentState } from "./deployment-actions";
import { isDeploymentAddress } from "@/lib/reviews/deployment";

export function DeploymentForm({ review = false, action }: {
  review?: boolean;
  action: (state: DeploymentState, form: FormData) => Promise<DeploymentState>;
}) {
  const [state, save, pending] = useActionState(action, {});
  const field = "block min-h-11 w-full rounded-lg border bg-card px-3";
  return <form action={save} className="space-y-3">
    {review ? <label className="block">{SITE.deployment.decision}
      <select aria-label={SITE.deployment.decision} name="verdict" required className={field} defaultValue="">
        <option value="" disabled>{SITE.deployment.choose}</option><option value="yes">{SITE.deployment.confirmed}</option><option value="no">{SITE.deployment.declined}</option>
      </select>
    </label> : <>
      <label className="block">{SITE.deployment.address}
        <input className={field} type="url" name="address" required maxLength={2048}
          onChange={event => event.target.setCustomValidity(isDeploymentAddress(event.target.value.trim()) ? "" : SITE.deployment.invalidAddress)} />
      </label>
      <label className="flex min-h-11 items-center gap-2"><input type="checkbox" name="synthetic" required />{SITE.deployment.synthetic}</label>
    </>}
    <label className="block">{review ? SITE.deployment.reason : SITE.deployment.note}
      <textarea name={review ? "reason" : "note"} className={field} required maxLength={1000} />
    </label>
    <Button type="submit" variant="outline" disabled={pending}>{review ? SITE.deployment.saveReview : SITE.deployment.submit}</Button>
    {state.error && <p role="alert">{state.error}</p>}{state.saved && <p role="status">{SITE.deployment.saved}</p>}
  </form>;
}
