# Les Pressings de Pau

Site vitrine commun à cinq pressings d'un même gérant, à Pau, Lons et Jurançon.
Réalisation : Christophe Mostefaoui (freelance, seul sur le projet).

Ce fichier est la source d'instructions unique pour Claude Code (via `CLAUDE.md`) et Codex.
Répondre et rédiger en français.

## Contexte confidentiel

**Lire `docs/prive/contexte-client.md` au début de chaque tâche** s'il existe : client, hiérarchie des documents sources (`docs/sources/`), faits internes, sociétés exploitantes. Ces fichiers ne sont pas versionnés (dépôt public) : ne jamais recopier leur contenu dans un fichier suivi par Git.

## Les magasins

| Enseigne            | Adresse                                                      | Téléphone      |
| ------------------- | ------------------------------------------------------------ | -------------- |
| Clean Discount      | 7 place du Foirail, 64000 Pau                                | 05 59 30 92 75 |
| MJ Pressing         | Galerie Auchan, 21 av. Didier-Daurat, 64140 Lons             | 05 59 62 09 94 |
| Pressing Sophia     | Centre commercial Prima, 318 bd de la Paix, 64000 Pau        | 05 59 62 64 58 |
| Pressing Notre-Dame | 7 bd Alsace-Lorraine, 64000 Pau                              | 05 59 30 38 82 |
| Pressing du Gave    | Centre commercial Beaugency, av. des Vallées, 64110 Jurançon | 05 59 06 31 14 |

- Horaires, services et informations internes : uniquement ceux fournis par Christophe (voir le contexte confidentiel). Ne jamais en reprendre d'un annuaire ou de Google.
- Tous les prix sont identiques dans les cinq magasins, et tous les magasins proposent tous les articles de la grille (`src/content/tarifs.json`).
- Seuls ces cinq magasins figurent sur le site.
- Professionnels (hôtels, entreprises autour de Pau) : collecte et livraison du linge ; pour les hôtels, collecte le matin et retour le jour même avant 17h. Contact : Pressing Sophia. Pas de livraison pour les particuliers.

## Périmètre

Site vitrine. Exclus : commande, paiement, espace client, multilingue.
Formulaire de contact : non décidé. Le téléphone est le contact principal.
Pages : accueil, `/pressings/` + une page par magasin, `/services/`, `/professionnels/`, `/tarifs/`, mentions légales, confidentialité.

## Stack

- **Astro** (sortie statique) + **TypeScript strict** + **Tailwind CSS**.
- **CI GitHub Actions** à chaque push : check, lint, format, tests, build.
- Hébergement prévu : **Cloudflare Workers Static Assets**, déploiement par GitHub Actions (`wrangler deploy`) et rebuild quotidien (fermetures passées). À mettre en place avec le domaine.
- Domaine et e-mail chez **OVH**, DNS délégués à Cloudflare au moment de la mise en ligne.
- Plus tard, peut-être : **Sveltia CMS** pour que le client édite horaires, fermetures et textes.

Node 24 via nvm (`.nvmrc`, `nvm use`). Commandes : `npm run dev`, `npm run build`, `npm run preview`, `npm run check` (astro check), `npm run lint`, `npm run format`, `npm test` (tests des horaires, `node --test`), `npm run verif-publication` (liste ce qui reste à valider avant la mise en ligne).

## Règles d'architecture

- **Toute donnée modifiable vit dans des content collections** (`src/content/`), validées par Zod. Jamais de donnée métier en dur dans un composant.
  - `magasins` : coordonnées, horaires à deux états (`a-confirmer` / `confirme` + date de vérification), fermetures datées, société, photos.
  - `tarifs` : grille commune, centimes TTC, `selection` = lignes affichées sur /tarifs/.
  - `services` : prestations reliées aux lignes de tarif (« à partir de » calculé).
  - `professionnels`, `societes`, `legal`, `reseau`, `faq` (vide pour l'instant).
- Une seule source par information : pages, cartes, JSON-LD, sitemap et badge d'ouverture lisent les mêmes fichiers.
- Le badge « ouvert maintenant » est calculé **dans le navigateur** (fuseau `Europe/Paris`, pauses, fermetures exceptionnelles, changement d'heure). Sinon, afficher seulement les horaires.
- Les fermetures exceptionnelles ont une date de fin et disparaissent seules.
- Zéro JavaScript côté client par défaut. Îlot interactif seulement si justifié.
- Pas d'API Google Places pour les horaires (CGU de Google).
- Pas de carte intégrée : les boutons « Itinéraire » ouvrent Google Maps. Si une carte est ajoutée un jour : chargement au clic uniquement (cookies tiers, RGPD).

## Design et images

- Très proche de pressing-biarritz.fr : Contrail One (titres) et Open Sans auto-hébergées, aplats bleu `#137CC1` ; `#0F6AA6` (`bleu-fonce`) pour boutons, bandeaux avec petit texte et liens (contraste AA). Liens soulignés par défaut, `no-underline` sur les boutons.
- Logo : texte provisoire.
- Images générées (Codex) : `src/assets/provisoire/` pour les magasins, avec badge « Image provisoire », bloquées par `verif-publication` ; `src/assets/illustrations/` pour des visuels neutres. Jamais présentées comme une vraie photo de magasin. Pas d'image provisoire dans les cartes magasins.
- Piège Prettier : il coupe les lignes, et un retour à la ligne entre deux éléments devient une espace (« 05 59 … 94 . »). Toute phrase avec ponctuation après un élément s'assemble en chaîne dans le code.

## SEO local et GEO (priorité du projet)

- Une page par magasin, titre « enseigne + ville », contenu propre à chaque magasin.
- JSON-LD `DryCleaningOrLaundry` par magasin, strictement cohérent avec le texte visible et la fiche Google (nom, adresse, téléphone, horaires).
- Chaque fiche Google pointera vers la page de son magasin (avec UTM), pas vers l'accueil.
- Pas de note ni d'avis en données structurées (avis auto-publiés ignorés par Google). Lien « Voir les avis Google » à la place.
- Coordonnées en HTML visible, vraies photos avec `alt` descriptif, FAQ rédigée avec les vraies réponses.
- Previews de branche en `noindex`.
- `llms.txt` facultatif, non prioritaire.

## Rédaction (tout texte publié)

- **Aucune information inventée** : prestation, délai, procédé, chiffre, ancienneté, argument écologique. Si une information manque, écrire `À CONFIRMER` et le signaler.
- Faits vérifiables plutôt que formules vagues (§8 du cahier) : pas de « travail de qualité », « meilleur pressing », « service exceptionnel ».
- Ancienneté : ne rien affirmer sans validation explicite du client.
- **Jamais de tiret cadratin ni demi-cadratin** (U+2014, U+2013), ni dans l'UI, ni dans les commentaires, ni dans les commits. Utiliser deux-points, virgule, parenthèses ou point.
- Phrases simples, voix active, pas de jargon publicitaire.
- Prix : TTC, à l'unité ou au m² ; « à partir de » quand plusieurs prix existent.

## Légal (France)

Pages `/mentions-legales/` et `/confidentialite/` générées depuis `src/content/legal/` et `src/content/societes/`. Obligatoire avant la mise en ligne : éditeur, directeur de la publication, e-mail, société de chaque magasin, médiateur de la consommation (listés par `npm run verif-publication`). Le site ne dépose aucun cookie : tout ajout de traceur exige un consentement préalable. Accord écrit pour citer un client.

## Journal de session

`docs/prive/journal/` (privé, non versionné) garde la mémoire du projet d'une session à l'autre, pour Claude Code et Codex. La dernière entrée est injectée au démarrage par un hook. En fin de session, rédiger l'entrée avec le skill `journal` : fait, décidé, appris, en attente, prochaine étape.

## Git et sécurité

- `main` = production. Push direct autorisé, pas de PR obligatoire.
- Messages en **Conventional Commits, en français** : `feat: ajoute la page MJ Pressing`, `fix: corrige les horaires de Sophia`.
- Aucune mention de Claude ou de Codex dans les commits (pas de `Co-Authored-By`).
- Secrets (token API Cloudflare, etc.) uniquement dans les secrets GitHub ou `.env` (gitignoré). Jamais dans le code.
- Tests : pas de suite lourde. Vérification = `npm run check`, `lint`, `format:check`, `npm test`, `build` (tous en CI) + contrôle visuel et Lighthouse mobile (100 visé en accessibilité, bonnes pratiques, SEO). Avant la mise en ligne : `npm run verif-publication`.
- Avant chaque commit : aucune information client interne dans les fichiers versionnés (dépôt public).
