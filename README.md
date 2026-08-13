# Lurnly

Le réseau des entrepreneurs francophones. Communautés par domaine, profil
entrepreneur, chiffre d'affaires vérifié par connexion Stripe/Shopify en
lecture seule, mise en relation.

**Aucune formation vendue.** Indicateur nord : le nombre de mises en relation
ayant abouti à un échange réel.

## Pile

Next.js 15 (App Router) · React 19 · TypeScript strict · Supabase (Postgres,
Auth, Storage) · Tailwind 4 · Zod · Biome · Vitest · pgTAP

## Où regarder

| Je cherche | J'ouvre |
|---|---|
| Les règles de travail | `CLAUDE.md` |
| Comment démarrer | `INSTALLATION.md` |
| Les 7 étapes de l'onboarding | `src/features/onboarding/etapes.ts` |
| Les contrôles d'accès | `src/dal/` |
| Le schéma et la RLS | `supabase/migrations/` |
| Les tests de permissions | `supabase/tests/` |

## État

Socle technique et onboarding. La landing, le magic link et les écrans produit
(salon, annuaire, annonce) restent à faire.
