-- Area privata di Maximize Academy (02/11/2026).
-- ATTENZIONE: si esegue nel progetto Supabase «maurizio-barber-shop» (NON in quello di Maximize):
-- gli account sono gli stessi dei due siti (decisione di Eliseo, 02/11/2026). Tutte le tabelle hanno il prefisso mx_.
-- SQL Editor -> New query -> incolla tutto -> Run. Si può rieseguire senza danni.
-- Allievo: vede solo il suo profilo, i suoi corsi, i materiali e gli avvisi dei corsi a cui è iscritto.
-- Admin di Maximize (ruolo admin o cofounder): gestisce tutto. Lo «staff» della barberia non vede nulla di Maximize.
-- Un cliente della barberia compare tra gli allievi solo dopo che è entrato almeno una volta in /area.

create or replace function public.mx_admin() returns boolean
language sql stable as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'cofounder'), false)
$$;

-- Profili Maximize: la riga la crea l'utente stesso al primo ingresso in /area
create table if not exists public.mx_profili (
  id         uuid primary key references auth.users (id) on delete cascade,
  nome       text check (char_length(nome) <= 120),
  email      text check (char_length(email) <= 200),
  telefono   text check (char_length(telefono) <= 40),
  creato_il  timestamptz not null default now()
);
alter table public.mx_profili enable row level security;
drop policy if exists mx_profili_lettura on public.mx_profili;
create policy mx_profili_lettura on public.mx_profili for select to authenticated using (id = auth.uid() or public.mx_admin());
drop policy if exists mx_profili_nuovo on public.mx_profili;
create policy mx_profili_nuovo on public.mx_profili for insert to authenticated with check (id = auth.uid());
drop policy if exists mx_profili_modifica on public.mx_profili;
create policy mx_profili_modifica on public.mx_profili for update to authenticated using (id = auth.uid() or public.mx_admin()) with check (id = auth.uid() or public.mx_admin());

-- Corsi
create table if not exists public.mx_corsi (
  id           uuid primary key default gen_random_uuid(),
  titolo       text not null check (char_length(titolo) between 2 and 120),
  descrizione  text check (char_length(descrizione) <= 2000),
  luogo        text check (char_length(luogo) <= 160),
  data_inizio  date,
  data_fine    date,
  attivo       boolean not null default true,
  creato_il    timestamptz not null default now(),
  check (data_fine is null or data_inizio is null or data_fine >= data_inizio)
);
alter table public.mx_corsi enable row level security;

-- Iscrizioni: le fa l'admin (l'allievo entra, poi Maurizio lo aggiunge al corso)
create table if not exists public.mx_iscrizioni (
  id             uuid primary key default gen_random_uuid(),
  allievo        uuid not null references public.mx_profili (id) on delete cascade,
  corso          uuid not null references public.mx_corsi (id) on delete cascade,
  stato          text not null default 'iscritto' check (stato in ('iscritto', 'completato')),
  completato_il  date,
  creato_il      timestamptz not null default now(),
  unique (allievo, corso)
);
alter table public.mx_iscrizioni enable row level security;

create or replace function public.mx_iscritto(c uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.mx_iscrizioni i where i.corso = c and i.allievo = auth.uid())
$$;
revoke all on function public.mx_iscritto(uuid) from public, anon;
grant execute on function public.mx_iscritto(uuid) to authenticated;

drop policy if exists mx_corsi_lettura on public.mx_corsi;
create policy mx_corsi_lettura on public.mx_corsi for select to authenticated using (public.mx_admin() or public.mx_iscritto(id));
drop policy if exists mx_corsi_scrittura on public.mx_corsi;
create policy mx_corsi_scrittura on public.mx_corsi for all to authenticated using (public.mx_admin()) with check (public.mx_admin());

drop policy if exists mx_iscrizioni_lettura on public.mx_iscrizioni;
create policy mx_iscrizioni_lettura on public.mx_iscrizioni for select to authenticated using (allievo = auth.uid() or public.mx_admin());
drop policy if exists mx_iscrizioni_scrittura on public.mx_iscrizioni;
create policy mx_iscrizioni_scrittura on public.mx_iscrizioni for all to authenticated using (public.mx_admin()) with check (public.mx_admin());

-- Materiali dei corsi (file nello spazio privato «mx-materiali», oppure un link)
create table if not exists public.mx_materiali (
  id         uuid primary key default gen_random_uuid(),
  corso      uuid not null references public.mx_corsi (id) on delete cascade,
  titolo     text not null check (char_length(titolo) between 1 and 160),
  tipo       text not null check (tipo in ('pdf', 'video', 'file', 'link')),
  path       text check (path is null or path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.[a-z0-9]{2,5}$'),
  url        text check (url is null or url ~ '^https://'),
  creato_il  timestamptz not null default now(),
  check ((tipo = 'link' and url is not null) or (tipo <> 'link' and path is not null))
);
alter table public.mx_materiali enable row level security;
drop policy if exists mx_materiali_lettura on public.mx_materiali;
create policy mx_materiali_lettura on public.mx_materiali for select to authenticated using (public.mx_admin() or public.mx_iscritto(corso));
drop policy if exists mx_materiali_scrittura on public.mx_materiali;
create policy mx_materiali_scrittura on public.mx_materiali for all to authenticated using (public.mx_admin()) with check (public.mx_admin());

-- Avvisi agli allievi: per tutti (corso vuoto) o per un corso. Separati dagli «avvisi» del sito della barberia.
create table if not exists public.mx_avvisi (
  id         uuid primary key default gen_random_uuid(),
  titolo     text not null check (char_length(titolo) between 2 and 120),
  testo      text check (char_length(testo) <= 1500),
  corso      uuid references public.mx_corsi (id) on delete cascade,
  creato_il  timestamptz not null default now()
);
alter table public.mx_avvisi enable row level security;
drop policy if exists mx_avvisi_lettura on public.mx_avvisi;
create policy mx_avvisi_lettura on public.mx_avvisi for select to authenticated using (public.mx_admin() or (corso is null and exists (select 1 from public.mx_profili p where p.id = auth.uid())) or public.mx_iscritto(corso));
drop policy if exists mx_avvisi_scrittura on public.mx_avvisi;
create policy mx_avvisi_scrittura on public.mx_avvisi for all to authenticated using (public.mx_admin()) with check (public.mx_admin());

-- Richieste dal modulo contatti di Maximize: chiunque le invia, solo l'admin le legge e cambia lo stato
create table if not exists public.mx_richieste (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 1 and 120),
  phone       text check (char_length(phone) <= 40),
  email       text check (char_length(email) <= 200),
  type        text check (char_length(type) <= 160),
  message     text check (char_length(message) <= 3000),
  status      text not null default 'Nuovo' check (status in ('Nuovo', 'Contattato', 'Chiuso')),
  check (phone is not null or email is not null)
);
alter table public.mx_richieste enable row level security;
drop policy if exists mx_richieste_invio on public.mx_richieste;
create policy mx_richieste_invio on public.mx_richieste for insert to anon, authenticated with check (status = 'Nuovo');
drop policy if exists mx_richieste_lettura on public.mx_richieste;
create policy mx_richieste_lettura on public.mx_richieste for select to authenticated using (public.mx_admin());
drop policy if exists mx_richieste_stato on public.mx_richieste;
create policy mx_richieste_stato on public.mx_richieste for update to authenticated using (public.mx_admin()) with check (public.mx_admin());
grant insert (name, phone, email, type, message) on public.mx_richieste to anon, authenticated;
grant select, update (status) on public.mx_richieste to authenticated;

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.mx_profili to authenticated;
grant select, insert, update, delete on public.mx_corsi, public.mx_iscrizioni, public.mx_materiali, public.mx_avvisi to authenticated;

-- Spazio file privato per i materiali (50 MB a file, il massimo del piano gratuito)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('mx-materiali', 'mx-materiali', false, 52428800, array['application/pdf', 'video/mp4', 'video/webm', 'video/quicktime', 'image/jpeg', 'image/png', 'image/webp', 'application/zip'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists mx_materiali_file_lettura on storage.objects;
create policy mx_materiali_file_lettura on storage.objects for select to authenticated using (
  bucket_id = 'mx-materiali' and (public.mx_admin() or public.mx_iscritto(((storage.foldername(name))[1])::uuid))
);
drop policy if exists mx_materiali_file_scrittura on storage.objects;
create policy mx_materiali_file_scrittura on storage.objects for insert to authenticated with check (bucket_id = 'mx-materiali' and public.mx_admin());
drop policy if exists mx_materiali_file_cancella on storage.objects;
create policy mx_materiali_file_cancella on storage.objects for delete to authenticated using (bucket_id = 'mx-materiali' and public.mx_admin());

select 'OK: area privata di Maximize pronta' as esito;
