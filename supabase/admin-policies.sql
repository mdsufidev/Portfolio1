-- Run this after creating public.contact_messages.
-- Create the admin user in Supabase Dashboard > Authentication > Users
-- using: sufi111729@gmail.com

grant select, update on table public.contact_messages to authenticated;

create policy "Only Sufiyan can read contact messages"
on public.contact_messages
for select
to authenticated
using ((select auth.jwt()->>'email') = 'sufi111729@gmail.com');

create policy "Only Sufiyan can update contact messages"
on public.contact_messages
for update
to authenticated
using ((select auth.jwt()->>'email') = 'sufi111729@gmail.com')
with check ((select auth.jwt()->>'email') = 'sufi111729@gmail.com');
