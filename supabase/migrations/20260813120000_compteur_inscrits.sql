-- =============================================================================
-- Compteur public d'inscrits.
--
-- Problème à résoudre : la landing est publique, mais la RLS de `profils`
-- réserve la lecture aux membres authentifiés. Un visiteur anonyme ne peut donc
-- pas compter les inscrits — et c'est très bien : on ne veut pas ouvrir la
-- table pour afficher un nombre.
--
-- Solution : une table d'agrégats en lecture publique, tenue à jour par un
-- déclencheur. Aucune donnée personnelle n'y transite, et personne ne peut
-- l'écrire via l'API — il n'existe aucune policy d'écriture.
--
-- Alternative écartée : une fonction SECURITY DEFINER exposée à `anon`.
-- `fondations-dev/02-securite.md` impose que ces fonctions vivent dans un
-- schéma non exposé ; les rendre appelables depuis l'API contredirait la règle.
-- Un COUNT(*) à chaque affichage de la page serait par ailleurs un scan complet
-- de table sur le chemin le plus chaud du site.
-- =============================================================================

create table if not exists public.compteurs (
  cle         text primary key,
  valeur      bigint not null default 0,
  modifie_le  timestamptz not null default now()
);

comment on table public.compteurs is
  'Agrégats publics. Aucune donnée personnelle. Écriture réservée aux déclencheurs.';

insert into public.compteurs (cle, valeur)
values ('inscrits', (select count(*) from public.profils))
on conflict (cle) do nothing;

alter table public.compteurs enable row level security;

-- Lecture ouverte, y compris aux visiteurs anonymes : c'est l'objet même
-- de cette table.
drop policy if exists "compteurs_lecture_publique" on public.compteurs;
create policy "compteurs_lecture_publique"
  on public.compteurs
  for select
  to anon, authenticated
  using (true);

-- Aucune policy d'insertion, de mise à jour ni de suppression.
-- Avec la RLS activée, l'absence de policy vaut refus : la table est donc
-- en lecture seule pour tout le monde côté API.

-- -----------------------------------------------------------------------------
-- Tenue à jour du compteur.
-- -----------------------------------------------------------------------------
create or replace function prive.maj_compteur_inscrits()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.compteurs
     set valeur = (select count(*) from public.profils),
         modifie_le = now()
   where cle = 'inscrits';
  return null;
end;
$$;

drop trigger if exists profils_compteur_inscrits on public.profils;
create trigger profils_compteur_inscrits
  after insert or delete on public.profils
  for each statement
  execute function prive.maj_compteur_inscrits();
