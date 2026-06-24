-- Extend intel validation trigger to Flawless Fluorite (same 20+ true votes rule as Roaming Oak)

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

  if report_type in ('fluorite', 'roaming_oak')
    and new.vote_type = 'true'
    and new_true_votes >= 20 then
    update public.info_reports
    set validated = true
    where id = new.report_id;
  end if;

  return new;
end;
$$;
