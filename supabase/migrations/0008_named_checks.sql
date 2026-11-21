-- Extra checks use their own content slug and the existing read-only policies.
begin;
alter table public.content_items drop constraint content_items_kind_check;
alter table public.content_items add constraint content_items_kind_check
  check (kind in ('module', 'unit', 'lesson', 'quiz', 'project', 'check'));
commit;
