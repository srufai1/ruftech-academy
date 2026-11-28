-- Learners submit a synthetic demo. Only the owner's signed account can review it.
begin;
create table public.deployment_submissions (
  id uuid primary key default gen_random_uuid(),
  item_slug text not null references public.content_items(slug) on delete restrict
    check (item_slug in ('m3-p1','m7-p4','m9-p5','py-p5')),
  learner uuid not null default auth.uid() references public.profiles(id) on delete restrict,
  address text not null check (length(address) <= 2048 and address ~ '^https://[a-zA-Z0-9.-]+(:[0-9]{1,5})?([/?#][^[:space:]]*)?$'),
  note text not null check (length(trim(note)) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index deployment_submissions_project_idx on public.deployment_submissions(item_slug, created_at desc);
create table public.deployment_reviews (
  submission_id uuid primary key references public.deployment_submissions(id) on delete restrict,
  reviewer uuid not null default auth.uid() references public.profiles(id) on delete restrict,
  confirmed boolean not null,
  reason text not null check (length(trim(reason)) between 1 and 1000),
  created_at timestamptz not null default now()
);
alter table public.deployment_submissions enable row level security;
alter table public.deployment_reviews enable row level security;
revoke all on public.deployment_submissions, public.deployment_reviews from public, anon, authenticated, service_role;
grant select, insert (item_slug, address, note) on public.deployment_submissions to authenticated;
grant select, insert (submission_id, confirmed, reason) on public.deployment_reviews to authenticated;
create policy submissions_read on public.deployment_submissions for select to authenticated
  using (learner = (select auth.uid()) or (select public.app_role()) = 'owner');
create policy submissions_add on public.deployment_submissions for insert to authenticated
  with check (learner = (select auth.uid()));
create policy deployment_reviews_read on public.deployment_reviews for select to authenticated
  using (exists (select 1 from public.deployment_submissions s where s.id = submission_id));
create policy deployment_reviews_add on public.deployment_reviews for insert to authenticated
  with check ((select public.app_role()) = 'owner' and reviewer = (select auth.uid()));
create trigger submissions_immutable before update or delete on public.deployment_submissions
  for each row execute function public.forbid_history_change();
create trigger submissions_no_truncate before truncate on public.deployment_submissions
  for each statement execute function public.forbid_history_change();
create trigger deployment_reviews_immutable before update or delete on public.deployment_reviews
  for each row execute function public.forbid_history_change();
create trigger deployment_reviews_no_truncate before truncate on public.deployment_reviews
  for each statement execute function public.forbid_history_change();
commit;
