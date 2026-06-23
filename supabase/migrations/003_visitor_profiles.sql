-- Visitor pseudo linked to IP hash (no account system)
create table if not exists public.visitor_profiles (
  ip_hash text primary key,
  pseudo text not null,
  updated_at timestamptz not null default now()
);

grant all on table public.visitor_profiles to service_role;
