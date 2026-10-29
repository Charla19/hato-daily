-- Heartopia house and build posts (photos + YouTube tutorials)

create table if not exists public.build_posts (
  id uuid primary key default gen_random_uuid(),
  day_key date not null,
  kind text not null check (kind in ('photo', 'video')),
  title text not null check (char_length(title) between 1 and 80),
  description text not null check (char_length(description) between 1 and 500),
  category text check (category is null or char_length(category) <= 28),
  author text not null,
  server text check (server is null or char_length(server) <= 40),
  open_to_visitors boolean not null default false,
  photo_url text,
  photo_path text,
  youtube_video_id text,
  submitter_key text not null,
  love_votes integer not null default 0 check (love_votes >= 0),
  inspiring_votes integer not null default 0 check (inspiring_votes >= 0),
  try_it_votes integer not null default 0 check (try_it_votes >= 0),
  created_at timestamptz not null default now(),
  constraint build_posts_media_check check (
    (kind = 'photo' and photo_url is not null and photo_path is not null and youtube_video_id is null)
    or (kind = 'video' and photo_url is null and photo_path is null and youtube_video_id is not null)
  ),
  constraint build_posts_youtube_id_check check (
    youtube_video_id is null or youtube_video_id ~ '^[A-Za-z0-9_-]{11}$'
  )
);

create index if not exists build_posts_created_idx on public.build_posts (created_at desc);
create index if not exists build_posts_submitter_day_idx on public.build_posts (day_key, submitter_key);

create table if not exists public.build_reactions (
  id uuid primary key default gen_random_uuid(),
  build_id uuid not null references public.build_posts (id) on delete cascade,
  voter_key text not null,
  reaction_type text not null check (reaction_type in ('love', 'inspiring', 'try_it')),
  created_at timestamptz not null default now(),
  unique (build_id, voter_key)
);

create or replace function public.bump_build_reaction_count(
  target_build_id uuid,
  reaction text,
  delta integer
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if reaction = 'love' then
    update public.build_posts set love_votes = greatest(0, love_votes + delta) where id = target_build_id;
  elsif reaction = 'inspiring' then
    update public.build_posts set inspiring_votes = greatest(0, inspiring_votes + delta) where id = target_build_id;
  elsif reaction = 'try_it' then
    update public.build_posts set try_it_votes = greatest(0, try_it_votes + delta) where id = target_build_id;
  end if;
end;
$$;

create or replace function public.apply_build_reaction_insert()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  perform public.bump_build_reaction_count(new.build_id, new.reaction_type, 1);
  return new;
end;
$$;

create or replace function public.apply_build_reaction_update()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if old.reaction_type is distinct from new.reaction_type then
    perform public.bump_build_reaction_count(old.build_id, old.reaction_type, -1);
    perform public.bump_build_reaction_count(new.build_id, new.reaction_type, 1);
  end if;
  return new;
end;
$$;

create or replace function public.apply_build_reaction_delete()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  perform public.bump_build_reaction_count(old.build_id, old.reaction_type, -1);
  return old;
end;
$$;

revoke all on function public.bump_build_reaction_count(uuid, text, integer) from public, anon, authenticated;
revoke all on function public.apply_build_reaction_insert() from public, anon, authenticated;
revoke all on function public.apply_build_reaction_update() from public, anon, authenticated;
revoke all on function public.apply_build_reaction_delete() from public, anon, authenticated;
grant execute on function public.bump_build_reaction_count(uuid, text, integer) to service_role;
grant execute on function public.apply_build_reaction_insert() to service_role;
grant execute on function public.apply_build_reaction_update() to service_role;
grant execute on function public.apply_build_reaction_delete() to service_role;

drop trigger if exists trg_build_reaction_insert on public.build_reactions;
create trigger trg_build_reaction_insert after insert on public.build_reactions
for each row execute function public.apply_build_reaction_insert();

drop trigger if exists trg_build_reaction_update on public.build_reactions;
create trigger trg_build_reaction_update after update on public.build_reactions
for each row execute function public.apply_build_reaction_update();

drop trigger if exists trg_build_reaction_delete on public.build_reactions;
create trigger trg_build_reaction_delete after delete on public.build_reactions
for each row execute function public.apply_build_reaction_delete();

insert into storage.buckets (id, name, public)
values ('build-gallery', 'build-gallery', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read build gallery" on storage.objects;
create policy "Public read build gallery" on storage.objects for select
using (bucket_id = 'build-gallery');

alter table public.build_posts enable row level security;
alter table public.build_reactions enable row level security;
grant all on table public.build_posts to service_role;
grant all on table public.build_reactions to service_role;
