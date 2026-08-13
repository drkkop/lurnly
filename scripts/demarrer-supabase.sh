#!/usr/bin/env bash
# Démarre Supabase en local, applique les migrations, génère .env.local et les
# types TypeScript, puis lance les tests de permissions.
set -uo pipefail
cd "$(dirname "$0")/.."

echo "→ Vérifications"
if ! command -v supabase >/dev/null 2>&1; then
  echo "  ✗ La CLI Supabase n'est pas installée."
  echo "    brew install supabase/tap/supabase"
  exit 1
fi
if ! docker info >/dev/null 2>&1; then
  echo "  ✗ Docker ne tourne pas. Ouvre Docker Desktop et attends qu'il soit prêt."
  exit 1
fi
echo "  ✓ CLI Supabase et Docker prêts"

echo
echo "→ Démarrage de la base (long au premier lancement : il télécharge les images)"
supabase start || exit 1

echo
echo "→ Génération de .env.local"
# `supabase status -o env` sort des variables shell : on les lit sans les
# afficher, pour ne pas laisser de clés dans l'historique du terminal.
eval "$(supabase status -o env)"
cat > .env.local <<ENV
# Généré par demarrer-supabase.sh — ne pas commiter (déjà dans .gitignore).
NEXT_PUBLIC_SUPABASE_URL=${API_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${ANON_KEY}
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=${SERVICE_ROLE_KEY}
ENV
echo "  ✓ .env.local écrit"

echo
echo "→ Application des migrations"
supabase db reset || exit 1

echo
echo "→ Génération des types TypeScript"
supabase gen types typescript --local > src/lib/supabase/types-base-de-donnees.ts && echo "  ✓ types générés"

echo
echo "→ Tests des policies RLS (les plus importants du dépôt)"
supabase test db

echo
echo "Terminé."
echo "  Base      : ${API_URL}"
echo "  Studio    : http://127.0.0.1:54333"
echo "  Emails    : http://127.0.0.1:54334   (Inbucket — rien ne part vers une vraie adresse)"
echo
echo "Ports décalés sur 5433x : flowdash_V2 garde la plage par défaut."
echo
echo "Relance maintenant : pnpm dev"
