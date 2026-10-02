---
name: maj-magasin
description: Modifier les informations d'un des cinq pressings (horaires, fermeture exceptionnelle, téléphone, adresse, société, photos) en gardant le site, la fiche Google et les annuaires cohérents. Utiliser dès qu'une donnée d'un magasin change.
argument-hint: "<magasin> <changement>"
---

# Mettre à jour un magasin

Une information incohérente entre le site et la fiche Google fait reculer le magasin dans Google Maps. Chaque modification suit donc ces étapes.

## 1. Vérifier la source

- L'information vient de Christophe ou du client, **jamais** d'un annuaire, de Google ou d'une supposition.
- En cas de doute, demander avant d'écrire.

## 2. Modifier la donnée (un seul endroit)

- Fichier `src/content/magasins/<magasin>.json`. Aucune donnée métier dans un composant.
- Horaires : `{ "statut": "confirme", "verifieLe": "AAAA-MM-JJ", "semaine": { "lundi": [{ "ouverture": "09:00", "fermeture": "12:30" }], ..., "samedi": [] } }`. Tableau vide = fermé. Heures locales de Paris, pauses déjeuner comprises. Exemple complet dans le README.
- « Du lundi au vendredi » sans précision : le samedi et le dimanche sont fermés, mais le dire à Christophe pour qu'il confirme.
- Téléphone au format E.164 (`+33559...`) : l'affichage est calculé.
- Fermeture exceptionnelle : toujours une date de début **et** une date de fin (elle disparaît seule après).
- Mettre à jour la **date de dernière vérification** du magasin.

## 3. Vérifier le site

- `npm run check`, `npm test` puis `npm run build`.
- Contrôler que la page du magasin, sa carte sur l'accueil et sur `/pressings/`, et le JSON-LD affichent la même valeur.
- Badge « ouvert maintenant » : tester les heures limites avec `etatOuverture()` sur les vraies données (ouverture incluse, fermeture exclue, pause, week-end).
- `npm run verif-publication` : le point « horaires à confirmer » du magasin doit disparaître.

## 4. Synchroniser hors du site (à faire par Christophe ou le client)

Donner à Christophe la liste des mises à jour à faire, avec les valeurs exactes :

- Fiche Google Business du magasin (horaires normaux ou horaires exceptionnels).
- Pages Jaunes et autres annuaires si la donnée y figure.
- Bing Places et Apple Business Connect si les fiches existent.

## 5. Commit

Conventional Commits en français, par exemple `fix: met à jour les horaires du Pressing du Gave`.

Après validation de Christophe, le push sur `main` publie le site (job `deployer` de la CI). Vérifier ensuite la page du magasin en ligne.
