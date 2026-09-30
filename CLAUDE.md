@AGENTS.md
@docs/prive/contexte-client.md

# Spécifique à Claude Code

## Codex

Codex CLI sert de second avis et de générateur d'images. Toujours passer par le skill `/codex-pressings` (le skill global `codex` sert au portfolio).

- À solliciter : quand Christophe le demande, et à chaque décision d'architecture importante (avis critique).
- Présenter l'avis de Codex à côté du tien, en signalant clairement les désaccords.
- Ne jamais appliquer une recommandation de Codex sans validation de Christophe.

## Skills du projet (`.claude/skills/`)

- `codex-pressings` : consulter Codex (avis critique, idées, revue, image).
- `maj-magasin` : modifier horaires, fermetures, coordonnées ou photos d'un magasin, avec synchro fiche Google.
- `seo-local` : checklist SEO local + GEO avant toute mise en ligne d'une page.
- `journal` : entrée de fin de session dans `docs/prive/journal/`.
- `deploy` : à créer au moment de la mise en ligne.

## Agents du projet (`.claude/agents/`)

- `verificateur-contenu` : relit les textes face aux sources, signale toute info inventée.
- `auditeur-seo-local` : audite le site construit (balises, JSON-LD, NAP, liens, Lighthouse).

## Hooks du projet (`.claude/hooks/`, non bloquants)

- `anti-cadratin.sh` : signale tout tiret cadratin dans un fichier modifié (partagé avec Codex).
- `rappel-secrets.sh` : avertit quand un fichier `.env*` ou un secret apparent est touché.
- `astro-check-stop.sh` : lance `astro check` en fin de réponse si le code a changé.
- `journal-demarrage.sh` : injecte la dernière entrée du journal au démarrage (partagé avec Codex).

Angle mort : les hooks Edit/Write ne voient pas les fichiers modifiés par Bash (`sed`, heredoc). Relire soi-même dans ce cas.

## Méthode de travail

- Christophe tranche ce qui engage le projet ou le client (architecture, contenu publié, coûts, commits et push) : proposer une recommandation, ne pas décider seul. Les petits choix d'outillage interne : les faire, puis les annoncer.
- Vérifier la doc à jour (MCP Astro Docs, MCP Cloudflare Docs, Context7) avant d'utiliser une API Astro, Tailwind ou Cloudflare. Signaler l'usage de Context7.
