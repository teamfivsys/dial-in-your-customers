-- KDial lightweight first-party visitor counter (no cookies, no IP storage, no external service).
create table if not exists public.site_stats (
  id int primary key,
  visits bigint not null default 0
);
insert into public.site_stats (id, visits) values (1, 0) on conflict (id) do nothing;

alter table public.site_stats enable row level security;
-- No anon policies: reads/writes go only through the definer RPCs below.

create or replace function public.record_visit() returns bigint
language plpgsql security definer set search_path = public as $$
declare n bigint;
begin
  update public.site_stats set visits = visits + 1 where id = 1 returning visits into n;
  return coalesce(n, 0);
end;
$$;

create or replace function public.get_visit_count() returns bigint
language sql security definer set search_path = public as $$
  select coalesce((select visits from public.site_stats where id = 1), 0)
$$;
