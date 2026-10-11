-- Breaking Point: user directory for the admin page.
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Safe to re-run.

-- 1. One row per user, filled automatically from Supabase Auth.
create table if not exists public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  email           text,
  full_name       text,
  avatar_url      text,
  provider        text,
  created_at      timestamptz not null default now(),
  last_sign_in_at timestamptz
);

-- 2. Who can open the in-site admin page (#admin). Add your own email below.
create table if not exists public.admins (
  email text primary key
);
-- insert into public.admins (email) values ('you@example.com') on conflict do nothing;

-- 3. Copy new users, and every sign-in, into profiles.
create or replace function public.sync_profile()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, provider, created_at, last_sign_in_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'),
    coalesce(new.raw_app_meta_data ->> 'provider', 'email'),
    new.created_at,
    new.last_sign_in_at
  )
  on conflict (id) do update set
    email           = excluded.email,
    full_name       = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url      = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    provider        = excluded.provider,
    last_sign_in_at = excluded.last_sign_in_at;
  return new;
end;
$$;

drop trigger if exists on_auth_user_changed on auth.users;
create trigger on_auth_user_changed
  after insert or update of last_sign_in_at, raw_user_meta_data on auth.users
  for each row execute function public.sync_profile();

-- Backfill anyone who signed up before this script ran.
insert into public.profiles (id, email, full_name, avatar_url, provider, created_at, last_sign_in_at)
select id, email,
       coalesce(raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'name'),
       coalesce(raw_user_meta_data ->> 'avatar_url', raw_user_meta_data ->> 'picture'),
       coalesce(raw_app_meta_data ->> 'provider', 'email'),
       created_at, last_sign_in_at
from auth.users
on conflict (id) do nothing;

-- 4. Access rules: users see their own row; admins see everyone.
create or replace function public.is_admin()
returns boolean
language sql stable
security definer set search_path = public
as $$
  select exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'));
$$;

alter table public.profiles enable row level security;
alter table public.admins enable row level security;

drop policy if exists "Own profile or admin" on public.profiles;
create policy "Own profile or admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

-- Profiles are read-only from the browser (no update policy): only sign-ups and
-- sign-ins change them, through the trigger above.
drop policy if exists "Update own name" on public.profiles;
grant select on public.profiles to authenticated;

-- The admins table is never readable from the browser; is_admin() checks it server-side.
-- Only signed-in users may call is_admin(); nobody may call sync_profile() directly
-- (the sign-up trigger still runs it).
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
revoke execute on function public.sync_profile() from public, anon, authenticated;

-- 5. Visitors: one row per page view, signed in or not.
--    The browser keeps a random visitor id (no IP address, no cookies).
--    Anyone can add a row; only admins can read them.
create table if not exists public.visits (
  id          bigint generated always as identity primary key,
  visitor_id  text not null check (char_length(visitor_id) between 8 and 64),
  user_id     uuid default auth.uid() references auth.users (id) on delete set null,
  path        text check (char_length(path) <= 200),
  referrer    text check (char_length(referrer) <= 300),
  device      text check (device in ('mobile', 'tablet', 'desktop')),
  timezone    text check (char_length(timezone) <= 64),
  language    text check (char_length(language) <= 16),
  created_at  timestamptz not null default now()
);
create index if not exists visits_created_at_idx on public.visits (created_at desc);
create index if not exists visits_visitor_idx on public.visits (visitor_id);

alter table public.visits enable row level security;

drop policy if exists "Anyone can record a visit" on public.visits;
create policy "Anyone can record a visit" on public.visits
  for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

drop policy if exists "Admins read visits" on public.visits;
create policy "Admins read visits" on public.visits
  for select using (public.is_admin());

grant insert (visitor_id, user_id, path, referrer, device, timezone, language) on public.visits to anon, authenticated;
grant select on public.visits to authenticated;

-- 6. Visitor statistics for the admin page, computed in the database.
--    Refuses to run for anyone who isn't in public.admins.
drop function if exists public.admin_visitor_stats(int);
create or replace function public.admin_visitor_stats(num_days int default 30, tz text default 'Asia/Kolkata')
returns json
language plpgsql stable
security definer set search_path = public
as $$
declare
  zone  text := case when exists (select 1 from pg_timezone_names where name = tz) then tz else 'UTC' end;
  since timestamptz := (date_trunc('day', now() at time zone zone) at time zone zone)
                       - make_interval(days => greatest(1, least(coalesce(num_days, 30), 365)) - 1);
begin
  if not public.is_admin() then
    raise exception 'Only admins can see visitor statistics' using errcode = '42501';
  end if;

  return json_build_object(
    'since', since,
    'totals', (
      select json_build_object(
        'views', count(*),
        'visitors', count(distinct visitor_id),
        'signed_in_visitors', count(distinct visitor_id) filter (where user_id is not null))
      from visits where created_at >= since),
    'today', (
      select json_build_object('views', count(*), 'visitors', count(distinct visitor_id))
      from visits where created_at >= (date_trunc('day', now() at time zone zone) at time zone zone)),
    'signups', (select count(*) from profiles where created_at >= since),
    'daily', (
      select coalesce(json_agg(d order by d.day), '[]'::json) from (
        select (created_at at time zone zone)::date as day, count(*) as views, count(distinct visitor_id) as visitors
        from visits where created_at >= since group by 1) d),
    'pages', (
      select coalesce(json_agg(p), '[]'::json) from (
        select path, count(*) as views, count(distinct visitor_id) as visitors
        from visits where created_at >= since group by path order by count(*) desc limit 15) p),
    'referrers', (
      select coalesce(json_agg(r), '[]'::json) from (
        select referrer, count(distinct visitor_id) as visitors
        from visits where created_at >= since and coalesce(referrer, '') <> ''
        group by referrer order by count(distinct visitor_id) desc limit 10) r),
    'devices', (
      select coalesce(json_agg(x), '[]'::json) from (
        select coalesce(device, 'desktop') as device, count(distinct visitor_id) as visitors
        from visits where created_at >= since group by 1 order by 2 desc) x),
    'users', (
      select coalesce(json_agg(u), '[]'::json) from (
        select user_id, max(created_at) as last_seen, count(*) as views
        from visits where user_id is not null group by user_id) u),
    'visitors', (
      select coalesce(json_agg(vs), '[]'::json) from (
        select v.visitor_id,
               min(v.created_at) as first_seen,
               max(v.created_at) as last_seen,
               count(*) as views,
               count(distinct v.path) as pages,
               (array_agg(v.device order by v.created_at desc))[1] as device,
               (array_agg(v.referrer order by v.created_at) filter (where coalesce(v.referrer, '') <> ''))[1] as referrer,
               (array_agg(v.timezone order by v.created_at desc) filter (where v.timezone is not null))[1] as timezone,
               max(p.email) as email,
               max(p.full_name) as full_name
        from visits v left join profiles p on p.id = v.user_id
        where v.created_at >= since
        group by v.visitor_id
        order by max(v.created_at) desc
        limit 500) vs)
  );
end;
$$;

revoke execute on function public.admin_visitor_stats(int, text) from public, anon;
grant execute on function public.admin_visitor_stats(int, text) to authenticated;
