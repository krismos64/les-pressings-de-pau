---
name: codex-pressings
description: Règles propres aux Pressings de Pau quand on consulte Codex (avis critique, idées, revue de code, image). Les appels passent par le skill global codex. Utiliser quand Christophe demande l'avis de Codex ou une image sur ce projet, ou avant de valider une décision d'architecture importante.
argument-hint: "[critique|idees|review|image] <sujet>"
---

# Codex sur Les Pressings de Pau

Les appels passent par le script du skill global `codex` (voir son SKILL.md pour
les options) :

```bash
S=~/.claude/skills/codex/codex.sh
```

Lancer depuis la racine du projet, en arrière-plan (`run_in_background`) : une
réponse prend de 1 à 10 minutes. Codex lit `AGENTS.md` à la racine, pas
l'historique de la conversation : lui donner le contexte utile avec
`--contexte AGENTS.md` ou `--contexte <fichier concerné>`.

Ne jamais appeler `codex` directement avec `-s` / `--sandbox` : ce drapeau
désactive le profil `lecture` de `~/.codex/config.toml` et rouvre la lecture de
tout le disque.

## Règles propres au projet

- Codex est un second avis indépendant. Il ne décide rien : Christophe tranche.
- Avis et idées : lui demander de vérifier les faits (la config du projet active
  la recherche web), de proposer des alternatives et de donner un verdict.
- Images : **jamais d'image générée présentée comme une vraie photo d'un
  magasin**, le site exige de vraies photos (cahier des charges §6). Les images
  générées servent aux maquettes, illustrations neutres ou visuels de réseaux
  sociaux, sans texte, logo ni enseigne lisible.
- Destinations des images : `src/assets/provisoire/facade-provisoire.jpg` ou
  `interieur-provisoire.jpg` (images de repli des magasins, badge automatique),
  ou `src/assets/illustrations/` (visuel neutre). Générer avec
  `$S image --sortie <fichier.png> "<description>"`, puis convertir en JPEG
  qualité 85 (`sips -s format jpeg -s formatOptions 85`) : les PNG générés
  pèsent environ 2 Mo.
- Montrer l'image à Christophe (Read du fichier) avant tout usage.

## Restitution à Christophe

- Présenter l'avis de Codex **à côté** du tien : points d'accord, points où il te
  corrige (et si tu lui donnes raison), désaccords restants.
- Signaler les affirmations de Codex non vérifiées.
- Ne rien appliquer sans validation.
