# Mise en route

## 1. Prérequis

- **Node 22+** et **pnpm 9+** (`npm install -g pnpm`)
- **Docker Desktop** en marche (nécessaire à Supabase en local)
- **Supabase CLI** (`brew install supabase/tap/supabase`)

## 2. Dépendances

```bash
pnpm install
```

Aucune dépendance n'est installée dans le dépôt : ce premier `pnpm install`
crée le `pnpm-lock.yaml`. Commiter le lockfile après.

## 3. Supabase en local

```bash
supabase start
```

La commande affiche une `API URL` et une `anon key`. Copier `.env.example` en
`.env.local` et les y coller :

```bash
cp .env.example .env.local
```

Puis appliquer la migration et générer les types :

```bash
supabase db reset          # applique supabase/migrations/ sur la base locale
pnpm db:types              # régénère src/lib/supabase/types-base-de-donnees.ts
```

**Régénérer les types après chaque migration.** C'est ce qui fait qu'une
colonne renommée casse le `typecheck` au lieu de casser en production.

## 4. Lancer

```bash
pnpm dev
```

L'onboarding est sur `/onboarding/domaine`. Il exige une session : tant que le
magic link n'est pas branché, la page redirige vers `/connexion`, qui n'existe
pas encore. C'est le prochain chantier.

## 5. Vérifier avant de pousser

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
supabase test db          # les tests RLS — les plus importants du dépôt
```

## 6. Projet Supabase distant

À créer **en région UE** (Paris `eu-west-3` ou Francfort) — obligation RGPD.
Deux projets minimum : dev et prod. Le schéma de prod n'est **jamais** modifié
depuis le dashboard : tout passe par une migration versionnée.

## 7. Gravures

Les sept gravures de l'onboarding vont dans `public/gravures/`, en WebP
niveaux de gris 1024×1536 :

```
01-main-descendante.webp   02-main-pousse.webp   03-main-stylo.webp
04-deux-mains.webp         05-paume-ouverte.webp 06-carnet.webp
07-main-photographie.webp
```

Sans elles, les écrans fonctionnent — l'image affiche simplement son texte
alternatif sur grand écran.
