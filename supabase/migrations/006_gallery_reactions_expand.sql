-- Gallery: extra reaction types (cute, bug, romance, brain)

alter table public.gif_submissions
  add column if not exists cute_votes integer not null default 0,
  add column if not exists bug_votes integer not null default 0,
  add column if not exists romance_votes integer not null default 0,
  add column if not exists brain_votes integer not null default 0;

alter table public.gif_reactions drop constraint if exists gif_reactions_reaction_type_check;

alter table public.gif_reactions
  add constraint gif_reactions_reaction_type_check
  check (reaction_type in ('haha', 'heart', 'cute', 'bug', 'romance', 'brain'));

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
  elsif reaction = 'heart' then
    update public.gif_submissions
    set heart_votes = greatest(0, heart_votes + delta)
    where id = target_gif_id;
  elsif reaction = 'cute' then
    update public.gif_submissions
    set cute_votes = greatest(0, cute_votes + delta)
    where id = target_gif_id;
  elsif reaction = 'bug' then
    update public.gif_submissions
    set bug_votes = greatest(0, bug_votes + delta)
    where id = target_gif_id;
  elsif reaction = 'romance' then
    update public.gif_submissions
    set romance_votes = greatest(0, romance_votes + delta)
    where id = target_gif_id;
  elsif reaction = 'brain' then
    update public.gif_submissions
    set brain_votes = greatest(0, brain_votes + delta)
    where id = target_gif_id;
  end if;
end;
$$;
