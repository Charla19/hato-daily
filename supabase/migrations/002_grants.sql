-- Hato Daily — grant privileges for API routes (service_role)
-- Run this if you disabled "Automatically expose new tables" in Supabase.

grant usage on schema public to service_role;

grant all on table public.info_reports to service_role;
grant all on table public.info_votes to service_role;
grant all on table public.outfit_submissions to service_role;
grant all on table public.outfit_votes to service_role;
grant all on table public.visitor_profiles to service_role;

grant all on all sequences in schema public to service_role;
grant execute on all functions in schema public to service_role;

-- Storage writes from API routes
grant all on storage.objects to service_role;
grant all on storage.buckets to service_role;
