# Les Pressings de Pau

Site vitrine commun à cinq pressings de Pau, Lons et Jurançon : adresses, horaires, services, tarifs et offre aux professionnels.

[![CI](https://github.com/krismos64/les-pressings-de-pau/actions/workflows/ci.yml/badge.svg)](https://github.com/krismos64/les-pressings-de-pau/actions/workflows/ci.yml)

Le site n'est pas encore en ligne. Nom de domaine prévu : `lespressingsdepau.fr`.

## Objectifs

- Permettre de **trouver un magasin, l'appeler ou obtenir l'itinéraire** en quelques secondes sur téléphone.
- Être bien référencé sur les recherches locales (« pressing Pau », « pressing Lons », « pressing Jurançon ») et compréhensible par les assistants IA.
- Rester **cohérent avec les fiches Google** de chaque magasin (nom, adresse, téléphone, horaires).

## Stack

| Élément     | Choix                                                         |
| ----------- | ------------------------------------------------------------- |
| Framework   | [Astro](https://astro.build) 7, sortie 100 % statique         |
| Langage     | TypeScript (preset `strictest`)                               |
| Styles      | [Tailwind CSS](https://tailwindcss.com) 4                     |
| Données     | Content collections validées par Zod                          |
| Polices     | Open Sans et Contrail One, auto-hébergées (Fonts API d'Astro) |
| Qualité     | ESLint 10, Prettier, `astro check`, tests `node --test`       |
| Hébergement | Cloudflare Workers Static Assets (à venir)                    |
| CI          | GitHub Actions                                                |

Aucun framework JavaScript côté client : environ 1 Ko de JavaScript par page, pour le badge « ouvert maintenant ».

## Démarrer

Prérequis : **Node.js 24** (les versions impaires comme Node 23 ne sont pas supportées par Astro 7).

```bash
nvm use          # lit la version dans .nvmrc
npm ci
npm run dev      # http://localhost:4321
```

## Commandes

| Commande                    | Rôle                                                |
| --------------------------- | --------------------------------------------------- |
| `npm run dev`               | Serveur de développement                            |
| `npm run build`             | Génère le site dans `dist/`                         |
| `npm run preview`           | Sert le site généré                                 |
| `npm run check`             | Vérification des types (`astro check`)              |
| `npm run lint`              | ESLint, règles d'accessibilité comprises            |
| `npm run format`            | Formate le code avec Prettier                       |
| `npm test`                  | Tests des fonctions d'horaires                      |
| `npm run verif-publication` | Liste ce qui reste à valider avant la mise en ligne |

## Structure

```
src/
├── content/            données du site (JSON)
│   ├── magasins/       un fichier par magasin : adresse, téléphone, horaires, fermetures
│   ├── services/       prestations, reliées aux lignes de tarif
│   ├── tarifs.json     grille de prix commune aux cinq magasins
│   ├── professionnels/ offre aux hôtels et entreprises
│   ├── societes/       sociétés exploitantes (mentions légales)
│   ├── legal/          éditeur et hébergeur
│   └── reseau/         nom et présentation du réseau
├── content.config.ts   schémas Zod de toutes les collections
├── lib/                fonctions pures (horaires, magasins, services) et tests
├── components/         en-tête, pied de page, cartes, badge d'ouverture
├── layouts/            gabarit commun (SEO, JSON-LD, polices)
├── pages/              une page par route, dont /pressings/[slug]/
└── assets/             images (provisoires et illustrations)
scripts/
└── verif-publication.ts
```

## Modifier le contenu

Toutes les informations métier vivent dans `src/content/`. Aucune n'est écrite en dur dans un composant : une donnée modifiée à un seul endroit met à jour les pages, les cartes, le JSON-LD et le sitemap.

**Horaires d'un magasin** : deux états possibles dans `src/content/magasins/<magasin>.json`.

```jsonc
// Tant que les horaires ne sont pas confirmés : la page affiche « appelez le magasin »
"horaires": { "statut": "a-confirmer" }

// Horaires confirmés : tableau, badge d'ouverture et JSON-LD activés
"horaires": {
  "statut": "confirme",
  "verifieLe": "2026-09-30",
  "semaine": {
    "lundi": [{ "ouverture": "09:00", "fermeture": "12:30" }, { "ouverture": "14:30", "fermeture": "18:00" }],
    "samedi": [],   // tableau vide = fermé
    …
  }
}
```

**Fermeture exceptionnelle** : ajouter `{ "du": "2026-12-24", "au": "2026-12-26" }` dans `fermetures` (fin incluse). L'annonce disparaît d'elle-même une fois la date passée.

**Tarifs** : `src/content/tarifs.json`, montants en centimes TTC. Le champ `selection` choisit les lignes affichées sur la page Tarifs ; les prix « à partir de » de la page Services sont calculés automatiquement.

Le build échoue si une donnée est incohérente (heure invalide, plages qui se chevauchent, fermeture qui finit avant de commencer, téléphone mal formé).

## Qualité et vérifications

À chaque push, la CI exécute `check`, `lint`, `format:check`, les tests et le build.

Objectifs mesurés avec Lighthouse mobile : 100 en accessibilité, bonnes pratiques et SEO sur toutes les pages.

**Images** : les fichiers de `src/assets/provisoire/` sont des images générées en attendant les vraies photos des magasins. Elles portent un badge « Image provisoire » et `npm run verif-publication` bloque la mise en ligne tant qu'elles existent.

## Conventions

- Branche `main` = production.
- Messages de commit en [Conventional Commits](https://www.conventionalcommits.org/fr/), en français : `feat: ajoute la page des tarifs`, `fix: corrige les horaires du Pressing du Gave`.
- Textes du site : faits vérifiables uniquement, aucune information inventée, pas de tiret cadratin.

## Assistants IA

Le projet est configuré pour [Claude Code](https://claude.com/claude-code) et [Codex CLI](https://github.com/openai/codex) :

- `AGENTS.md` : instructions communes aux deux outils ;
- `CLAUDE.md`, `.claude/` : skills, agents de vérification et hooks propres à Claude Code ;
- `.codex/`, `.agents/` : configuration et skills partagés avec Codex.

Le dossier `docs/` contient des documents client confidentiels : il reste local et n'est pas versionné.

## Réalisation

[Christophe Mostefaoui](https://christophe-dev-freelance.fr), développeur freelance.
