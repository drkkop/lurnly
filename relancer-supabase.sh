#!/usr/bin/env bash
# Cycle propre : arrêt, redémarrage, migrations, types, tests.
set -uo pipefail
cd "$(dirname "$0")"

echo "→ Arrêt de Lurnly (flowdash_V2 n'est pas touché)"
supabase stop --project-id lurnly 2>/dev/null

echo
echo "→ Redémarrage"
supabase start || exit 1

echo
echo "→ Migrations"
supabase db reset || { echo "  ✗ db reset a échoué — relance avec --debug pour voir la cause"; exit 1; }

echo
echo "→ Vérification du schéma"
supabase gen types typescript --local > src/lib/supabase/types-base-de-donnees.ts
if grep -q "profils" src/lib/supabase/types-base-de-donnees.ts; then
  echo "  ✓ tables profils et compteurs présentes"
else
  echo "  ✗ le schéma est vide — les migrations ne se sont pas appliquées"
  exit 1
fi

echo
echo "→ Tests des policies RLS"
supabase test db
