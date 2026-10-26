-- Richieste del modulo contatti di Maximize Academy (api/contact.js). Progetto Supabase di Maximize.
-- Si esegue una volta: SQL Editor -> New query -> Run. Si può rieseguire senza danni.
-- Il sito può solo AGGIUNGERE richieste (chiave pubblica). Leggerle si può solo dal pannello Supabase (Table Editor → leads).
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) <= 120),
  phone       text check (char_length(phone) <= 40),
  email       text check (char_length(email) <= 200),
  type        text check (char_length(type) <= 60),
  message     text check (char_length(message) <= 3000),
  status      text not null default 'Nuovo' check (status in ('Nuovo', 'Contattato', 'Chiuso'))
);
alter table public.leads enable row level security;
revoke all on public.leads from anon, authenticated;
grant insert on public.leads to anon;
drop policy if exists leads_nuove on public.leads;
create policy leads_nuove on public.leads for insert to anon with check (status = 'Nuovo');
select 'OK: richieste pronte' as esito;
