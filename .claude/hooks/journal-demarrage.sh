#!/bin/bash
# SessionStart (Claude Code et Codex) : injecte la dernière entrée du journal de session.
# Silencieux si le journal n'existe pas (autre poste, CI) : docs/prive/ n'est pas versionné.

INPUT=$(cat)
DIR="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
JOURNAL="$DIR/docs/prive/journal"
[ -d "$JOURNAL" ] || exit 0

DERNIERE=$(ls -1 "$JOURNAL"/*.md 2>/dev/null | sort | tail -1)
[ -n "$DERNIERE" ] || exit 0

python3 -c '
import json, os, sys
chemin = sys.argv[1]
contenu = open(chemin, encoding="utf-8").read()
entete = (
    f"Journal de session : dernière entrée ({os.path.basename(chemin)}), "
    "lue automatiquement. Reprendre depuis « En attente » et « Prochaine étape ». "
    "En fin de session, rédiger la nouvelle entrée avec le skill journal.\n\n"
)
print(json.dumps({"hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": entete + contenu}}, ensure_ascii=False))
' "$DERNIERE"
exit 0
