#!/usr/bin/env bash
set -uo pipefail
cd "$(dirname "$0")"
B="https://www.figma.com/api/mcp/asset"
mkdir -p .tmp-figma
max=0; gagnant=""
i=0
for id in 9351635e-c42b-42d7-adc8-16582911f8d3 6b33c5e6-abe5-40d4-ae91-2648fce099bf ff593e94-c28b-46f8-846e-76240d65bbda ddc694af-ffb0-4261-be3c-26c2c25a9b8b; do
  i=$((i+1)); curl -sS -L -o ".tmp-figma/$i.png" "$B/$id" || continue
  t=$(wc -c < ".tmp-figma/$i.png")
  if [ "$t" -gt "$max" ]; then max=$t; gagnant=".tmp-figma/$i.png"; fi
done
if [ "$max" -gt 100000 ]; then
  cp "$gagnant" public/gravures/01-main-descendante.png
  echo "public/gravures/01-main-descendante.png  ($((max/1024)) Ko)"
else
  echo "ÉCHEC — exporte la main de l'étape 1 à la main depuis Figma (nœud 146:128)."
fi
rm -rf .tmp-figma
