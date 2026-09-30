---
name: journal
description: Rédiger l'entrée du journal de session (ce qui a été fait, décidé, ce qui reste en attente, la prochaine étape) dans docs/prive/journal/. Utiliser en fin de session, avant de s'arrêter, ou quand Christophe demande de mettre à jour le journal.
---

# Journal de session

Le journal garde la mémoire du projet d'une session à l'autre, pour Claude Code **et** Codex. La dernière entrée est injectée automatiquement au démarrage de chaque session (hook `journal-demarrage.sh`).

## Emplacement

`docs/prive/journal/AAAA-MM-JJ-sujet-court.md` : **privé, non versionné** (le dépôt GitHub est public). On peut y écrire les décisions client et les points sensibles.

Plusieurs sessions le même jour : suffixe `-2`, `-3`, ou compléter l'entrée du jour si c'est la suite directe.

## Rédiger l'entrée

1. Relire l'entrée précédente pour ne pas répéter ce qui était déjà acquis.
2. Récupérer les faits : `git log --oneline` depuis la dernière entrée, `npm run verif-publication` pour les points en attente.
3. Écrire l'entrée avec le modèle ci-dessous. Faits précis, phrases courtes, pas de tiret cadratin.
4. Mettre à jour la section « En attente » en entier : c'est elle que la session suivante lit en premier.

## Modèle

```markdown
# AAAA-MM-JJ : sujet de la session

Outil : Claude Code | Codex

## Fait

- … (avec les commits : `abc1234 feat: …`)

## Décidé

- Décision : raison courte (qui a tranché).

## Appris

- Fait découvert qui change quelque chose (registre, contrainte technique, piège).

## En attente

- De Christophe / du client : …
- Technique : …

## Prochaine étape

- Une ou deux actions concrètes, dans l'ordre.
```

## À ne pas mettre

- Secrets, tokens, mots de passe.
- Le détail de ce que Git garde déjà (diffs) : juste le hash et le message.
