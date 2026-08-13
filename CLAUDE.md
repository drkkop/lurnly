# Contrat de travail — Lurnly

Ce fichier est lu automatiquement au début de chaque session. Il condense
`fondations-dev/` : en cas de contradiction, ce sont les documents du projet
qui font foi.

## Le produit en trois lignes

Lurnly est le **réseau social** des entrepreneurs francophones : on y discute,
on demande conseil, on trouve des prestataires, on monte des projets.

**Ce n'est pas une place de marché.** Toute formulation transactionnelle est à
refuser. **Aucune formation n'est vendue** — c'est le positionnement.

**Pas de hiérarchie entre membres.** Quelqu'un qui arrive « juste par
curiosité » est aussi légitime qu'un membre à 380 k€ de chiffre d'affaires.
Aucun titre, aucun copy, aucun tri ne doit classer les gens par palier de
revenus.

## Vocabulaire figé

un **salon** (jamais « groupe », jamais « channel ») · une **communauté** ·
une **annonce** · un **membre vérifié** · le **badge** · une **mise en
relation** · la **liste d'attente** · un **fondateur**.

Copy : vouvoiement, ratio 2-3 « vous » pour 1 « nous ».

## Architecture

- `app/` ne contient **que du routage**. La logique vit dans `src/features/<domaine>/`.
- Chaque feature expose son API via `index.ts`. Pas d'import croisé sauvage.
- La **DAL** (`src/dal/`) est le seul endroit qui lit et écrit des données.
  Tout module y commence par `import 'server-only'`.
- La DAL renvoie des **DTO minimaux**, jamais la ligne brute de la base.
- `process.env` n'est lu que dans la DAL et les handlers serveur.

## Sécurité — non négociable

1. **RLS activée dans le même fichier de migration que la création de table.**
   Les tables créées par SQL ne l'ont pas par défaut. Chaque policy précise
   `TO authenticated`, utilise `(select auth.uid())`, et définit **`USING` ET
   `WITH CHECK`**.
2. Côté serveur : **`getClaims()`, jamais `getSession()`**.
3. Le middleware **rafraîchit la session, il ne protège rien** (CVE-2025-29927).
4. Toute Server Action exportée est un **endpoint POST public** : elle
   revérifie l'authentification **et la propriété de la ressource**. L'identifiant
   de la ressource vient du JWT, jamais d'un paramètre client.
5. Jamais de `dangerouslySetInnerHTML` sur du contenu utilisateur.
6. Aucune erreur brute (base, Stripe) renvoyée au client : `{ ok: false, code }`,
   l'UI traduit.
7. Jamais de `NEXT_PUBLIC_` sur un secret. `.env*` dans `.gitignore`.

## Design

- **Monochrome. Il n'y a pas de couleur primaire.** Encre `#100C08`, papier
  `#F8F7FA`. Seule couleur : le vert de validation `#149E63`, strictement
  fonctionnel (badge CA vérifié, succès).
- Typo : **Bricolage Grotesque** (display) · **General Sans** (corps,
  auto-hébergée) · **JetBrains Mono** (données chiffrées uniquement).
- Le **filet de 1 px** remplace les cartes à bordure et ombre. On ne
  réintroduit pas d'ombre.
- Rayons : bouton 9 · champ 9 · pastille 6 · panneau 15 · carte 16. **Jamais
  une valeur unique.**
- Les gravures **disparaissent sous `lg`**. Trois traitements mobiles ont été
  testés et rejetés — ne pas les réintroduire.
- Le mode sombre est obligatoire.
- Sans couleur, le **focus clavier** est le point d'accessibilité le plus
  fragile : jamais d'`outline: none`.

## Definition of done

Une fonctionnalité n'est finie que si **tout** est vrai :

- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` passent.
- [ ] Toute nouvelle table a sa RLS activée **et** son test pgTAP négatif.
- [ ] Toute nouvelle Server Action revérifie auth + propriété.
- [ ] Toute entrée externe a son schéma Zod.
- [ ] Les tests sont écrits **avec** la fonctionnalité, pas après.
- [ ] Le mode sombre est traité.
- [ ] Les états vides sont dessinés — un profil sans photo ni bio doit avoir
      l'air *conçu*, pas cassé.

## Pièges déjà rencontrés

- `upsert()` de Supabase **n'accepte pas** de `.eq()` derrière.
- Ne jamais mettre un module `'server-only'` dans la chaîne d'import d'un test
  Vitest — extraire la logique pure (fait pour `completion.ts`).
- Un `RECTANGLE` Figma n'a pas de `clipsContent` : appliquer le `cornerRadius`
  à l'image elle-même.
- Les enfants d'une **SECTION** Figma sont en coordonnées **relatives**.
- Le `letter-spacing` des titres dérive à chaque duplication : il doit rester
  autour de −0,9 px.
