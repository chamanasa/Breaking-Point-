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

drop policy if exists "Update own name" on public.profiles;
create policy "Update own name" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- The admins table is never readable from the browser; is_admin() checks it server-side.
grant execute on function public.is_admin() to authenticated;

-- Users may change only their display name, nothing else on their row.
revoke update on public.profiles from authenticated, anon;
grant update (full_name) on public.profiles to authenticated;
