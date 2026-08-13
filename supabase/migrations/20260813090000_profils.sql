-- =============================================================================
-- Table `profils` — profil entrepreneur, alimenté par l'onboarding.
--
-- RÈGLE ABSOLUE : la RLS est activée dans le MÊME fichier que la création de
-- la table. Les tables créées par SQL n'ont pas la RLS par défaut (contrairement
-- à celles créées depuis le dashboard) ; c'est exactement la cause de
-- CVE-2025-48757. Une migration qui crée une table sans l'activer ici est un
-- bug de sécurité, pas un oubli de style.
-- =============================================================================

create table if not exists public.profils (
  id           uuid primary key references auth.users (id) on delete cascade,

  prenom       text,
  pseudo       text unique,
  domaine      text,
  arrivee      text,
  recherche    text[] not null default '{}',
  apport       text[] not null default '{}',
  bio          text,
  photo_url    text,

  -- Badge « CA vérifié ». Écrit uniquement côté serveur après la connexion
  -- Stripe/Shopify en lecture seule. On ne stocke que l'agrégat, jamais les
  -- transactions détaillées (minimisation RGPD).
  ca_verifie   boolean not null default false,
  ca_verifie_le timestamptz,

  cree_le      timestamptz not null default now(),
  modifie_le   timestamptz not null default now(),

  constraint pseudo_format check (
    pseudo is null or pseudo ~ '^[a-z0-9_]{3,30}$'
  ),
  constraint bio_longueur check (bio is null or char_length(bio) <= 280),
  constraint prenom_longueur check (prenom is null or char_length(prenom) between 2 and 50)
);

comment on table public.profils is
  'Profil entrepreneur. Une ligne par utilisateur authentifié.';
comment on column public.profils.ca_verifie is
  'Agrégat uniquement. Jamais de transactions détaillées, jamais de pièce d''identité.';

create index if not exists profils_pseudo_idx on public.profils (pseudo);
create index if not exists profils_domaine_idx on public.profils (domaine);

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.profils enable row level security;

-- Lecture : tout membre authentifié voit les profils. C'est un réseau social,
-- l'annuaire est le produit. Les colonnes sensibles ne sont pas dans cette
-- table (les jetons OAuth vivent dans un schéma non exposé à l'API).
drop policy if exists "profils_lecture_membres" on public.profils;
create policy "profils_lecture_membres"
  on public.profils
  for select
  to authenticated
  using (true);

-- Insertion : uniquement sa propre ligne.
-- `with check` est indispensable — sans lui, l'écriture reste ouverte même
-- quand la lecture est protégée. C'est l'oubli le plus fréquent.
drop policy if exists "profils_insertion_proprietaire" on public.profils;
create policy "profils_insertion_proprietaire"
  on public.profils
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

-- Mise à jour : uniquement sa propre ligne, et on ne peut pas la réattribuer.
-- `(select auth.uid())` et non `auth.uid()` : l'appel enveloppé est évalué une
-- fois au lieu d'une fois par ligne (~95 % de gain sur les grandes tables).
drop policy if exists "profils_maj_proprietaire" on public.profils;
create policy "profils_maj_proprietaire"
  on public.profils
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Suppression : self-service, exigé dès le MVP (RGPD).
-- La cascade vient de la clé étrangère sur auth.users.
drop policy if exists "profils_suppression_proprietaire" on public.profils;
create policy "profils_suppression_proprietaire"
  on public.profils
  for delete
  to authenticated
  using ((select auth.uid()) = id);

-- -----------------------------------------------------------------------------
-- `ca_verifie` n'est jamais modifiable par le membre lui-même.
-- La RLS autorise la mise à jour de sa ligne : ce déclencheur garantit que le
-- badge ne peut pas être auto-attribué en passant par l'API REST.
-- -----------------------------------------------------------------------------
create schema if not exists prive;
revoke all on schema prive from anon, authenticated;

create or replace function prive.figer_badge_verification()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if current_setting('role', true) is distinct from 'service_role' then
    new.ca_verifie := old.ca_verifie;
    new.ca_verifie_le := old.ca_verifie_le;
  end if;
  return new;
end;
$$;

drop trigger if exists profils_figer_badge on public.profils;
create trigger profils_figer_badge
  before update on public.profils
  for each row
  execute function prive.figer_badge_verification();

-- -----------------------------------------------------------------------------
-- Horodatage de modification.
-- -----------------------------------------------------------------------------
create or replace function prive.toucher_modifie_le()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.modifie_le := now();
  return new;
end;
$$;

drop trigger if exists profils_toucher_modifie_le on public.profils;
create trigger profils_toucher_modifie_le
  before update on public.profils
  for each row
  execute function prive.toucher_modifie_le();
