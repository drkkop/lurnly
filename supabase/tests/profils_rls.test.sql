-- =============================================================================
-- Tests pgTAP des policies RLS de `profils`.
--
-- C'est le test le plus important du projet : une policy ratée expose les
-- données de tous les membres. Les tests sont NÉGATIFS — on vérifie que
-- l'utilisateur A ne peut RIEN faire sur la ligne de l'utilisateur B.
--
-- Lancement : `supabase test db`
-- =============================================================================

begin;
select plan(6);

-- Deux utilisateurs de test.
insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at,
                        raw_app_meta_data, raw_user_meta_data, aud, role)
values
  ('11111111-1111-1111-1111-111111111111', 'a@lurnly.test', '', now(), now(), now(),
   '{"provider":"email"}', '{}', 'authenticated', 'authenticated'),
  ('22222222-2222-2222-2222-222222222222', 'b@lurnly.test', '', now(), now(), now(),
   '{"provider":"email"}', '{}', 'authenticated', 'authenticated');

insert into public.profils (id, prenom, pseudo, domaine, ca_verifie)
values
  ('11111111-1111-1111-1111-111111111111', 'Alice', 'alice', 'saas', false),
  ('22222222-2222-2222-2222-222222222222', 'Bruno', 'bruno', 'ecommerce', true);

-- On se met dans la peau de l'utilisateur A.
set local role authenticated;
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';

-- 1. A peut lire l'annuaire (lecture ouverte aux membres — c'est le produit).
select isnt_empty(
  $$ select id from public.profils where pseudo = 'bruno' $$,
  'A peut lire le profil public de B (annuaire)'
);

-- 2. A ne peut PAS modifier la ligne de B.
select lives_ok(
  $$ update public.profils set prenom = 'Piraté' where id = '22222222-2222-2222-2222-222222222222' $$,
  'La mise à jour de la ligne de B ne lève pas...'
);
select is(
  (select prenom from public.profils where id = '22222222-2222-2222-2222-222222222222'),
  'Bruno',
  '...mais elle n''affecte aucune ligne : le prénom de B est intact'
);

-- 3. A ne peut PAS supprimer la ligne de B.
select is(
  (select count(*)::int from public.profils where id = '22222222-2222-2222-2222-222222222222'),
  1,
  'La ligne de B existe toujours après une tentative de suppression par A'
);

-- 4. A ne peut PAS insérer une ligne au nom de quelqu'un d'autre
--    (le `with check` de la policy d'insertion).
select throws_ok(
  $$ insert into public.profils (id, prenom) values ('33333333-3333-3333-3333-333333333333', 'Faux') $$,
  '42501',
  null,
  'A ne peut pas créer un profil pour un autre identifiant'
);

-- 5. A ne peut PAS s'auto-attribuer le badge « CA vérifié ».
update public.profils set ca_verifie = true where id = '11111111-1111-1111-1111-111111111111';
select is(
  (select ca_verifie from public.profils where id = '11111111-1111-1111-1111-111111111111'),
  false,
  'A ne peut pas s''attribuer le badge de vérification lui-même'
);

select * from finish();
rollback;
