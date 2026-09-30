#!/bin/bash
# PostToolUse (Claude : Edit|Write, Codex : apply_patch)
# Signale les tirets cadratins et demi-cadratins dans les fichiers modifiés.
# Non bloquant : renvoie un contexte additionnel au modèle, jamais de refus.
# Partagé entre Claude Code (.claude/settings.json) et Codex (.codex/hooks.json).

INPUT=$(cat)

printf '%s' "$INPUT" | python3 -c '
import json, os, re, sys

try:
    data = json.load(sys.stdin)
except Exception:
    sys.exit(0)

cwd = data.get("cwd") or os.getcwd()
tool_input = data.get("tool_input") or {}

# Claude : tool_input.file_path. Codex : chemins dans le patch (tool_input.command).
paths = []
if tool_input.get("file_path"):
    paths.append(tool_input["file_path"])
patch = tool_input.get("command") or ""
if isinstance(patch, list):
    patch = "\n".join(str(p) for p in patch)
for m in re.finditer(r"^\*\*\* (?:Add|Update) File: (.+)$", patch, re.M):
    paths.append(m.group(1).strip())

SKIP = ("/node_modules/", "/dist/", "/.astro/", "/.git/", "/docs/sources/", "package-lock.json")
TEXT_EXT = (".astro", ".ts", ".tsx", ".js", ".mjs", ".json", ".md", ".mdx",
            ".yaml", ".yml", ".html", ".css", ".txt", ".toml", ".sh")

findings = []
for p in paths:
    full = p if os.path.isabs(p) else os.path.join(cwd, p)
    if any(s in full for s in SKIP) or not full.endswith(TEXT_EXT) or not os.path.isfile(full):
        continue
    try:
        with open(full, encoding="utf-8") as f:
            lines = f.readlines()
    except Exception:
        continue
    hits = [f"  ligne {i}: {l.strip()[:120]}" for i, l in enumerate(lines, 1) if "—" in l or "–" in l]
    if hits:
        rel = os.path.relpath(full, cwd)
        findings.append(f"{rel} ({len(hits)} occurrence(s))\n" + "\n".join(hits[:10]))

if findings:
    msg = ("Tiret cadratin ou demi-cadratin détecté (interdit dans ce projet, UI comprise). "
           "Remplacer par deux-points, virgule, parenthèses ou point :\n" + "\n".join(findings))
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": data.get("hook_event_name", "PostToolUse"),
        "additionalContext": msg}}, ensure_ascii=False))
'
exit 0
