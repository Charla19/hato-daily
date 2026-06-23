-- Hato Daily — initial schema
-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

-- ---------------------------------------------------------------------------
-- Intel reports (Flawless Fluorite, Roaming Oak, weather, other)
-- ---------------------------------------------------------------------------
create table if not exists public.info_reports (
  id uuid primary key default gen_random_uuid(),
  day_key date not null,
  type text not null check (type in ('fluorite', 'roaming_oak', 'weather', 'other')),
  description text not null,
  location_id text,
  position_id text,
  author text,
  true_votes integer not null default 0,
  false_votes integer not null default 0,
  validated boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists info_reports_day_key_idx on public.info_reports (day_key);
create index if not exists info_reports_day_type_idx on public.info_reports (day_key, type);

-- ---------------------------------------------------------------------------
-- Intel votes (one vote per anonymous voter per report)
-- ---------------------------------------------------------------------------
create table if not exists public.info_votes (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.info_reports (id) on delete cascade,
  voter_key text not null,
  vote_type text not null check (vote_type in ('true', 'false')),
  created_at timestamptz not null default now(),
  unique (report_id, voter_key)
);

create or replace function public.apply_info_vote()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  report_type text;
  new_true_votes integer;
begin
  if new.vote_type = 'true' then
    update public.info_reports
    set true_votes = true_votes + 1
    where id = new.report_id
    returning type, true_votes into report_type, new_true_votes;
  else
    update public.info_reports
    set false_votes = false_votes + 1
    where id = new.report_id
    returning type into report_type;
  end if;

  if report_type = 'roaming_oak' and new.vote_type = 'true' and new_true_votes >= 20 then
    update public.info_reports
    set validated = true
    where id = new.report_id;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_apply_info_vote on public.info_votes;
create trigger trg_apply_info_vote
after insert on public.info_votes
for each row execute function public.apply_info_vote();

-- ---------------------------------------------------------------------------
-- Outfit submissions (max 50 per day enforced in API)
-- ---------------------------------------------------------------------------
create table if not exists public.outfit_submissions (
  id uuid primary key default gen_random_uuid(),
  day_key date not null,
  username text not null,
  server text not null,
  player_id text not null,
  image_url text not null,
  image_path text not null,
  votes integer not null default 0,
  submitter_key text not null,
  created_at timestamptz not null default now(),
  unique (day_key, submitter_key)
);

create index if not exists outfit_submissions_day_key_idx on public.outfit_submissions (day_key);
create index if not exists outfit_submissions_day_votes_idx on public.outfit_submissions (day_key, votes desc);

-- ---------------------------------------------------------------------------
-- Outfit likes (one per voter per outfit)
-- ---------------------------------------------------------------------------
create table if not exists public.outfit_votes (
  id uuid primary key default gen_random_uuid(),
  outfit_id uuid not null references public.outfit_submissions (id) on delete cascade,
  voter_key text not null,
  created_at timestamptz not null default now(),
  unique (outfit_id, voter_key)
);

create or replace function public.apply_outfit_vote()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.outfit_submissions
  set votes = votes + 1
  where id = new.outfit_id;
  return new;
end;
$$;

drop trigger if exists trg_apply_outfit_vote on public.outfit_votes;
create trigger trg_apply_outfit_vote
after insert on public.outfit_votes
for each row execute function public.apply_outfit_vote();

-- ---------------------------------------------------------------------------
-- Storage bucket for outfit screenshots
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('outfit-images', 'outfit-images', true)
on conflict (id) do update set public = true;

-- Public read; writes go through service role API routes only
create policy "Public read outfit images"
on storage.objects for select
using (bucket_id = 'outfit-images');

-- ---------------------------------------------------------------------------
-- Privileges (required when "Automatically expose new tables" is disabled)
-- ---------------------------------------------------------------------------
grant usage on schema public to service_role;

grant all on table public.info_reports to service_role;
grant all on table public.info_votes to service_role;
grant all on table public.outfit_submissions to service_role;
grant all on table public.outfit_votes to service_role;

grant all on all sequences in schema public to service_role;
grant execute on all functions in schema public to service_role;

grant all on storage.objects to service_role;
grant all on storage.buckets to service_role;

