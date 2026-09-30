---
name: codex
description: Consulter Codex CLI pour un avis critique, de nouvelles idées, une revue de code ou la génération d'une image. Utiliser quand Christophe demande l'avis de Codex, une image, ou avant de valider une décision d'architecture importante.
argument-hint: "[critique|idees|review|image] <sujet>"
---

# Consulter Codex

Codex est un second avis indépendant. Il ne décide rien : Christophe tranche.

## Règles d'appel (toutes les commandes)

- **Toujours fermer stdin avec `< /dev/null`**, sinon `codex exec` attend une saisie et reste bloqué indéfiniment.
- Lancer en arrière-plan (`run_in_background`) : une réponse prend de 1 à 10 minutes. macOS n'a pas `timeout`.
- Écrire la réponse finale dans un fichier avec `-o` (stdout contient aussi la progression).
- Donner à Codex le contexte utile : il lit `AGENTS.md` automatiquement quand on lance depuis la racine du projet, pas l'historique de la conversation.
- Si Codex est vieux (`codex --version` vs `npm view @openai/codex version`), lancer `codex update`.

## Avis critique ou idées (lecture seule)

```bash
codex exec -C "$CLAUDE_PROJECT_DIR" -s read-only --ephemeral \
  -o "$SCRATCH/codex-avis.md" "<prompt>" < /dev/null > "$SCRATCH/codex.log" 2>&1
```

`$SCRATCH` = répertoire scratchpad de la session. Structure du prompt :

1. Rôle : « consultant senior, critique et sans complaisance ».
2. Contexte : la décision ou le fichier concerné, les contraintes, ce qui est déjà décidé et **non validé**.
3. Demande : vérifier les faits (Codex a la recherche web), critiquer, proposer des alternatives, donner un verdict.
4. Format : français, concis, pas de tirets cadratins.

## Revue de code

```bash
codex review --uncommitted < /dev/null > "$SCRATCH/codex-review.md" 2>&1
```

Variantes : `--base main`, `--commit <sha>`. Ne pas combiner un prompt positionnel avec `--base` ou `--uncommitted` (refusé par certaines versions).

## Génération d'image

Outil `image_gen` intégré (gpt-image-2 sur le compte ChatGPT, sans clé API). Il faut l'écriture pour la copie finale :

```bash
codex exec -C "$CLAUDE_PROJECT_DIR" -s workspace-write --ephemeral \
  -o "$SCRATCH/codex-image.md" '$imagegen <description précise : sujet, cadrage, style, format, ratio>. Enregistre le résultat dans <chemin/fichier.png>.' < /dev/null
```

- Si le fichier n'apparaît pas dans le projet, le récupérer dans `~/.codex/generated_images/` (le plus récent).
- Image de référence possible avec `-i <fichier>`.
- **Jamais d'image générée présentée comme une vraie photo d'un magasin** : le site exige de vraies photos (cahier des charges §6). Les images générées servent aux maquettes, illustrations neutres ou visuels de réseaux sociaux.
- Destination : `src/assets/provisoire/facade-provisoire.jpg` ou `interieur-provisoire.jpg` (images de repli des magasins, badge automatique) ou `src/assets/illustrations/` (visuel neutre). Demander des images sans texte, logo ni enseigne lisible.
- Convertir ensuite en JPEG qualité 85 (`sips -s format jpeg -s formatOptions 85`) : les PNG générés pèsent environ 2 Mo.
- Montrer l'image à Christophe (Read du fichier) avant tout usage.

## Restitution à Christophe

- Présenter l'avis de Codex **à côté** du tien : points d'accord, points où il te corrige (et si tu lui donnes raison), désaccords restants.
- Signaler les affirmations de Codex non vérifiées.
- Ne rien appliquer sans validation.
