# Configuration Claude Code et Codex : Les Pressings de Pau

Mise en place le 30 septembre 2026, chaque choix validé par Christophe.

## Instructions

- `AGENTS.md` : source unique, lue par Codex et par Claude Code.
- `CLAUDE.md` : `@AGENTS.md` + règles propres à Claude (Codex, skills, agents, hooks).

## Claude Code (`.claude/`)

| Élément                       | Rôle                                                                                                                          |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `settings.json`               | Permissions du projet (aucun deny), `wrangler deploy` en confirmation, attribution désactivée, MCP du projet approuvés, hooks |
| `hooks/anti-cadratin.sh`      | PostToolUse Edit/Write : signale les tirets U+2014 et U+2013. Partagé avec Codex                                              |
| `hooks/rappel-secrets.sh`     | PostToolUse Edit/Write : rappel si `.env*` ou secret apparent                                                                 |
| `hooks/astro-check-stop.sh`   | Stop : `astro check` si le code a changé depuis la dernière vérification. Silencieux tant qu'Astro n'est pas installé         |
| `skills/codex`                | Consulter Codex (avis, idées, review, image)                                                                                  |
| `skills/maj-magasin`          | Modifier un magasin + synchro fiche Google                                                                                    |
| `skills/seo-local`            | Checklist SEO local + GEO                                                                                                     |
| `agents/verificateur-contenu` | Lecture seule : infos inventées, formules vagues, cadratins                                                                   |
| `agents/auditeur-seo-local`   | Lecture seule : audit du site construit + Lighthouse                                                                          |

Tous les hooks sont **non bloquants**. Angle mort : un fichier modifié via Bash (`sed`, heredoc) ne déclenche pas les hooks Edit/Write.

Skill `deploy` : à écrire au moment de la mise en ligne (workflow GitHub Actions, bascule DNS OVH vers Cloudflare sans perdre les e-mails).

## Codex (`.codex/`, `.agents/`)

| Élément              | Rôle                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| `.codex/config.toml` | workspace-write, on-request, reasoning high, web search live, MCP Astro et Cloudflare. Modèle non figé |
| `.codex/hooks.json`  | Même hook anti-cadratin (outil `apply_patch`)                                                          |
| `.agents/skills/`    | Liens vers `maj-magasin`, `seo-local` et `journal` (une seule source dans `.claude/skills/`)           |

Le projet est « trusted » dans `~/.codex/config.toml` (condition pour charger `.codex/`).
**À faire une fois** : dans Codex interactif, `/hooks` pour approuver le hook (l'approbation est liée à son contenu, à refaire après modification).

## MCP (`.mcp.json` pour Claude, `.codex/config.toml` pour Codex)

- `astro-docs` : https://mcp.docs.astro.build/mcp
- `cloudflare-docs` : https://docs.mcp.cloudflare.com/mcp

Context7 et chrome-devtools viennent de la config globale.

## Hors projet (modifié le 30/09/2026, sauvegardes horodatées)

- `~/.claude/scripts/hook-format-on-write.sh` : ajout de `*.astro` (sauvegarde dans `~/.claude/backups/`).
- `~/.codex/config.toml` : `/Users/chris` retiré des projets trusted, Pressings ajouté (sauvegarde `config.toml.bak.*`).
- `~/.zshrc` : `export GITHUB_PERSONAL_ACCESS_TOKEN="$(gh auth token)"` pour le MCP GitHub du plugin officiel (sauvegarde dans `~/.claude/backups/`).

## Versionnement

Tout est versionné sauf `.claude/settings.local.json`, `CLAUDE.local.md`, `docs/sources/` et `docs/prive/` (documents et contexte client confidentiels, conservés en local). **Dépôt public** : aucune information client interne dans les fichiers versionnés.
