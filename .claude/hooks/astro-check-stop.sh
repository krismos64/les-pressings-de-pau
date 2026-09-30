#!/bin/bash
# Stop : lance `astro check` en fin de réponse si le code source a changé
# depuis la dernière vérification. Non bloquant : affiche un résumé des erreurs.

INPUT=$(cat)
DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$DIR" || exit 0

# Projet Astro pas encore initialisé : rien à faire.
[ -f package.json ] && [ -d node_modules/astro ] || exit 0

# Empreinte de l'état du code (modifs suivies + fichiers non suivis dans src/).
STATE=$(
  { git diff HEAD -- src astro.config.* tsconfig.json 2>/dev/null
    git ls-files --others --exclude-standard -- src 2>/dev/null | xargs -I{} stat -f '%N %m' {} 2>/dev/null
  } | shasum | cut -d' ' -f1
)
CACHE="${TMPDIR:-/tmp}/pressings-astro-check-$(printf '%s' "$DIR" | shasum | cut -c1-8)"
[ -f "$CACHE" ] && [ "$(cat "$CACHE")" = "$STATE" ] && exit 0

OUT=$(npx --no-install astro check 2>&1)
STATUS=$?
printf '%s' "$STATE" > "$CACHE"

[ $STATUS -eq 0 ] && exit 0

SUMMARY=$(printf '%s\n' "$OUT" | grep -E 'error|Error|- [0-9]+ (error|warning)' | head -15)
python3 -c '
import json, sys
print(json.dumps({"systemMessage": "astro check signale des erreurs :\n" + sys.argv[1]}, ensure_ascii=False))
' "$SUMMARY"
exit 0
