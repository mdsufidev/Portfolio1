-- Contact form + /sufi admin permissions
-- Safe to run more than once in Supabase SQL Editor.

alter table public.contact_messages enable row level security;

-- Start from least privilege.
revoke all on table public.contact_messages from anon, authenticated;

-- Public website visitors may submit only.
grant insert on table public.contact_messages to anon;

-- Signed-in admin may submit, read and update statuses.
grant insert, select, update on table public.contact_messages to authenticated;

drop policy if exists "Anyone can submit contact messages" on public.contact_messages;
drop policy if exists "Only Sufiyan can read contact messages" on public.contact_messages;
drop policy if exists "Only Sufiyan can update contact messages" on public.contact_messages;

create policy "Anyone can submit contact messages"
on public.contact_messages
for insert
to anon, authenticated
with check (true);

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

-- No DELETE policy is created intentionally.
