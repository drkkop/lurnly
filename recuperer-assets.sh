#!/usr/bin/env bash
# Récupère les images depuis Figma. Les URL expirent — à lancer tout de suite.
# Pour chaque écran, Figma renvoie plusieurs images ; on garde la plus lourde,
# qui est toujours la gravure (les autres sont des avatars ou des fragments).
set -uo pipefail
cd "$(dirname "$0")"
mkdir -p public/gravures public/hero .tmp-figma
B="https://www.figma.com/api/mcp/asset"

garder_la_plus_lourde() {
  local sortie="$1"; shift
  local i=0 max=0 gagnant=""
  for id in "$@"; do
    i=$((i+1))
    curl -sS -L -o ".tmp-figma/$i.png" "$B/$id" || continue
    local t; t=$(wc -c < ".tmp-figma/$i.png")
    if [ "$t" -gt "$max" ]; then max=$t; gagnant=".tmp-figma/$i.png"; fi
  done
  if [ -n "$gagnant" ]; then
    cp "$gagnant" "$sortie"
    echo "  $sortie  ($((max/1024)) Ko)"
  else
    echo "  ÉCHEC pour $sortie"
  fi
  rm -f .tmp-figma/*.png
}

echo "Hero — les deux mains"
garder_la_plus_lourde public/hero/mains.png 6fff622c-fb92-4cec-949c-e76d0526c53e d4c34615-2928-4a61-9111-37105980d1d6 750da7f8-6356-4b18-bb6c-c4dda8016984 0d540c61-90ce-4aa6-a3af-e4cb64375394

echo "Gravures de l'onboarding"
curl -sS -L -o public/gravures/01-main-descendante.png "$B/6e43dfab-8d5b-404c-aa51-77355eedf926" && echo "  public/gravures/01-main-descendante.png"
garder_la_plus_lourde public/gravures/02-main-pousse.png      91d2537b-f9d8-45db-ae59-ac5f2b708b9b f9d14c43-ab5c-4260-a3fa-d9f054e5fd0e 5af477de-5fd8-4c6e-bcf3-22fcd17b8e04 ccdb8354-b0b0-4d7b-a1b9-f4f0f3c4ddcd
garder_la_plus_lourde public/gravures/03-main-stylo.png       a9b9adb7-1715-41e6-a615-74fdcd832c18 ec09290c-3bb4-4d91-b07c-8767514afa98 d35016ac-3294-420a-bfe0-78120a42ea77 28ed8d3f-4a6a-43c5-9ed1-4a1cb76cd9d3
garder_la_plus_lourde public/gravures/04-deux-mains.png       385ee38c-c25a-400a-8f05-867b9a60abac 0eb41a54-9599-4874-b744-deaeacee547d 8a56e76e-40bb-49a2-96f9-f8690639d91f 46a324f3-6fcc-4b5a-94a8-4a313c75b19a
garder_la_plus_lourde public/gravures/05-paume-ouverte.png    c3c622c2-ad7b-485e-bf70-5060f81abee0 6b25f145-c353-41dc-b74f-ed71cfba8415 145bd449-1f20-4321-9773-c1541f36b5b6 5d9547c5-0235-4cdf-b81d-38513fb80c87
garder_la_plus_lourde public/gravures/06-carnet.png           c4951929-13d5-4d79-a185-64a867df8fa6 afacd3fb-de03-490a-8bc1-5b66c13d9505 ce5db5b6-60ff-49c4-829e-b0cddbcada4e 7a8149d8-79a1-4c4b-b403-4243dfa90a48
garder_la_plus_lourde public/gravures/07-main-photographie.png 78b00b56-c0a1-454d-82ff-aa70f200d6b9 5865a55e-03a0-458e-a9a1-b074f1ce81cc 9c289930-be31-4b6e-a31e-f590516cf283 f66afb28-a4b1-42b0-8fa3-67ec5dc002d1

echo "Avatars de la section 2"
mkdir -p public/demo
curl -sS -L -o public/demo/camille.png "$B/d2c46706-7ab9-4c18-b985-e710de513d6b.png" && echo "  public/demo/camille.png"
curl -sS -L -o public/demo/yanis.png   "$B/5b350621-f5b3-4f9d-ae7f-10aba22a9755.png" && echo "  public/demo/yanis.png"
curl -sS -L -o public/demo/sofia.png   "$B/5cc726da-32c3-4873-81e4-aecab45f2232.png" && echo "  public/demo/sofia.png"

rmdir .tmp-figma 2>/dev/null
echo
echo "Terminé. Vérifie public/gravures/ — chaque fichier doit peser plus de 100 Ko."
