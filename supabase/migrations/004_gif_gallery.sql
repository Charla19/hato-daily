-- Hato Daily — Heartopia GIF gallery
-- Run in Supabase SQL Editor after 001–003

create table if not exists public.gif_submissions (
  id uuid primary key default gen_random_uuid(),
  day_key date not null,
  author text not null,
  image_url text not null,
  image_path text not null,
  submitter_key text not null,
  haha_votes integer not null default 0,
  heart_votes integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists gif_submissions_day_key_idx on public.gif_submissions (day_key);
create index if not exists gif_submissions_day_created_idx on public.gif_submissions (day_key, created_at desc);
create index if not exists gif_submissions_submitter_day_idx on public.gif_submissions (day_key, submitter_key);

create table if not exists public.gif_reactions (
  id uuid primary key default gen_random_uuid(),
  gif_id uuid not null references public.gif_submissions (id) on delete cascade,
  voter_key text not null,
  reaction_type text not null check (reaction_type in ('haha', 'heart')),
  created_at timestamptz not null default now(),
  unique (gif_id, voter_key)
);

create or replace function public.bump_gif_reaction_count(
  target_gif_id uuid,
  reaction text,
  delta integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if reaction = 'haha' then
    update public.gif_submissions
    set haha_votes = greatest(0, haha_votes + delta)
    where id = target_gif_id;
  else
    update public.gif_submissions
    set heart_votes = greatest(0, heart_votes + delta)
    where id = target_gif_id;
  end if;
end;
$$;

create or replace function public.apply_gif_reaction_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.bump_gif_reaction_count(new.gif_id, new.reaction_type, 1);
  return new;
end;
$$;

create or replace function public.apply_gif_reaction_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.reaction_type is distinct from new.reaction_type then
    perform public.bump_gif_reaction_count(old.gif_id, old.reaction_type, -1);
    perform public.bump_gif_reaction_count(new.gif_id, new.reaction_type, 1);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_apply_gif_reaction_insert on public.gif_reactions;
create trigger trg_apply_gif_reaction_insert
after insert on public.gif_reactions
for each row execute function public.apply_gif_reaction_insert();

drop trigger if exists trg_apply_gif_reaction_update on public.gif_reactions;
create trigger trg_apply_gif_reaction_update
after update on public.gif_reactions
for each row execute function public.apply_gif_reaction_update();

insert into storage.buckets (id, name, public)
values ('gif-gallery', 'gif-gallery', true)
on conflict (id) do update set public = true;

create policy "Public read gif gallery"
on storage.objects for select
using (bucket_id = 'gif-gallery');

grant all on table public.gif_submissions to service_role;
grant all on table public.gif_reactions to service_role;
