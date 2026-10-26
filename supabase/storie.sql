-- Storie di Maximize Academy (cerchio «Novità» in home). Progetto Supabase di Maximize, separato da Maurizio Barber Shop.
-- Si esegue una volta: SQL Editor -> New query -> Run. Si può rieseguire senza danni.
-- Lettura pubblica: solo le storie attive oggi (ora di Roma). Scrittura: solo chi ha il ruolo admin (Maurizio, Eliseo).

create or replace function public.mx_admin() returns boolean
language sql stable as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'cofounder'), false)
$$;

create table if not exists public.storie (
  id           uuid primary key default gen_random_uuid(),
  tipo         text not null check (tipo in ('foto', 'video', 'testo', 'numero')),
  titolo       text check (char_length(titolo) <= 90),
  testo        text check (char_length(testo) <= 280),
  titolo_en    text check (char_length(titolo_en) <= 90),
  testo_en     text check (char_length(testo_en) <= 280),
  numero       text check (char_length(numero) <= 24),
  media_path   text,
  pulsante     text check (char_length(pulsante) <= 30),
  pulsante_en  text check (char_length(pulsante_en) <= 30),
  link         text check (link is null or link ~ '^(/[^/]|/$|https://)'),
  dal          date not null default ((now() at time zone 'Europe/Rome')::date),
  al           date,
  ordine       int not null default 0,
  liberatoria  boolean not null default false,
  creato_da    uuid default auth.uid(),
  creato_il    timestamptz not null default now(),
  check (al is null or al >= dal),
  check (tipo not in ('foto', 'video') or (media_path is not null and liberatoria)),
  check (tipo <> 'numero' or numero is not null),
  check (tipo <> 'testo' or titolo is not null)
);
create index if not exists storie_giorni on public.storie (dal, al, ordine);
alter table public.storie enable row level security;

drop policy if exists storie_lettura on public.storie;
create policy storie_lettura on public.storie for select using (
  (dal <= (now() at time zone 'Europe/Rome')::date and (al is null or al >= (now() at time zone 'Europe/Rome')::date))
  or public.mx_admin()
);
drop policy if exists storie_scrittura on public.storie;
create policy storie_scrittura on public.storie for all to authenticated
  using (public.mx_admin()) with check (public.mx_admin());

create or replace function public.riordina_storie(ids uuid[]) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.mx_admin() then raise exception 'permesso negato'; end if;
  if array_length(ids, 1) > 100 then raise exception 'troppe storie'; end if;
  update public.storie s set ordine = x.pos - 1
  from unnest(ids) with ordinality as x(id, pos) where s.id = x.id;
end $$;
revoke all on function public.riordina_storie(uuid[]) from public, anon;
grant execute on function public.riordina_storie(uuid[]) to authenticated;

grant usage on schema public to anon, authenticated;
grant select on public.storie to anon;
grant select, insert, update, delete on public.storie to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('storie', 'storie', true, 20971520, array['image/jpeg','image/png','image/webp','video/mp4','video/webm','video/quicktime'])
on conflict (id) do update set public = true, file_size_limit = 20971520,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','video/mp4','video/webm','video/quicktime'];

drop policy if exists storie_file_lettura on storage.objects;
create policy storie_file_lettura on storage.objects for select using (bucket_id = 'storie');
drop policy if exists storie_file_scrittura on storage.objects;
create policy storie_file_scrittura on storage.objects for insert to authenticated with check (bucket_id = 'storie' and public.mx_admin());
drop policy if exists storie_file_elimina on storage.objects;
create policy storie_file_elimina on storage.objects for delete to authenticated using (bucket_id = 'storie' and public.mx_admin());

select 'OK: storie di Maximize pronte' as esito;
