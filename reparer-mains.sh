#!/usr/bin/env bash
set -uo pipefail
cd "$(dirname "$0")"
curl -sS -L -o public/hero/mains.png "https://www.figma.com/api/mcp/asset/06dc5a42-8a08-4314-bcf3-64dc4e2d987b.png"
t=$(wc -c < public/hero/mains.png)
if [ "$t" -gt 200000 ]; then echo "public/hero/mains.png  ($((t/1024)) Ko) — nœud exporté, déjà recadré"
else echo "ÉCHEC ($t octets)"; fi
