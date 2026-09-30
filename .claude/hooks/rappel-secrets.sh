#!/bin/bash
# PostToolUse (Edit|Write) : rappel non bloquant quand un fichier .env* est touché
# ou qu'une valeur ressemblant à un secret apparaît dans un fichier versionnable.

INPUT=$(cat)

printf '%s' "$INPUT" | python3 -c '
import json, os, re, sys

try:
    data = json.load(sys.stdin)
except Exception:
    sys.exit(0)

path = (data.get("tool_input") or {}).get("file_path") or ""
if not path or not os.path.isfile(path):
    sys.exit(0)
if any(s in path for s in ("/node_modules/", "/dist/", "/.git/", "/docs/sources/")):
    sys.exit(0)

name = os.path.basename(path)
msgs = []

if name.startswith(".env") and name != ".env.example":
    msgs.append(f"{name} modifié : il doit rester hors Git (vérifier .gitignore). "
                "En production, les secrets vont dans les secrets GitHub Actions, pas dans un fichier.")
else:
    pattern = re.compile(
        r"(api[_-]?token|api[_-]?key|secret|password|passwd|client[_-]?secret)"
        r"[\"\x27]?\s*[:=]\s*[\"\x27]?[A-Za-z0-9_\-\.]{20,}", re.I)
    try:
        with open(path, encoding="utf-8") as f:
            text = f.read()
    except Exception:
        sys.exit(0)
    if pattern.search(text):
        msgs.append(f"{os.path.basename(path)} semble contenir un secret en clair. "
                    "Le déplacer dans .env (local) ou dans les secrets GitHub, et ne pas le commiter.")

if msgs:
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PostToolUse",
        "additionalContext": " ".join(msgs)}}, ensure_ascii=False))
'
exit 0
