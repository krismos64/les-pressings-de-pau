---
name: seo-local
description: Checklist SEO local et GEO propre aux Pressings de Pau (pages magasins, JSON-LD DryCleaningOrLaundry, cohérence NAP avec les fiches Google, balises, maillage, Lighthouse mobile). Utiliser avant de publier ou de modifier une page, et pour tout audit SEO du site.
---

# SEO local et GEO

Pour un audit complet, déléguer à l'agent `auditeur-seo-local`. Les skills globaux `seo-audit` et `ai-seo` complètent cette checklist.

## Objectif

Qu'une personne cherchant « pressing Pau », « pressing Lons », « pressing Jurançon », « nettoyage costume Pau », « nettoyage couette Pau » ou « repassage Pau » trouve le bon magasin et l'appelle.

## Checklist par page magasin

- [ ] `<title>` : enseigne + ville + repère (« MJ Pressing, pressing à Lons (Galerie Auchan) »), moins de 60 caractères.
- [ ] Meta description factuelle, moins de 155 caractères.
- [ ] Un seul `<h1>`, qui reprend l'enseigne et la ville.
- [ ] Nom, adresse, téléphone **identiques caractère pour caractère** à la fiche Google et au JSON-LD.
- [ ] Téléphone cliquable `tel:` et bouton itinéraire.
- [ ] Horaires en HTML visible (pas seulement en JSON-LD).
- [ ] JSON-LD `DryCleaningOrLaundry` : `@id` stable, `name`, `address` (`PostalAddress`), `telephone`, `geo`, `openingHoursSpecification`, `url`, `hasMap`, `image`, `parentOrganization` vers le réseau. Aucune note ni avis.
- [ ] Contenu propre au magasin (accès, stationnement, services disponibles) : pas de texte dupliqué entre les cinq pages.
- [ ] Vraies photos, `alt` descriptif, formats optimisés par Astro.
- [ ] Liens vers les magasins proches et vers `/services/`.
- [ ] URL canonique, présente dans le sitemap.

## Checklist site

- [ ] `robots.txt` autorise les robots de recherche et d'IA (Googlebot, Bingbot, GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot).
- [ ] Previews de branche en `noindex`.
- [ ] Accueil : les cinq magasins au même niveau, trois villes citées dans le `<h1>` ou le premier paragraphe.
- [ ] FAQ avec les vraies réponses (données `FAQPage` seulement si le contenu est visible).
- [ ] JSON-LD `Organization` du réseau sur l'accueil, relié aux magasins.
- [ ] Aucune information inventée, aucune formule vague (règles de rédaction d'`AGENTS.md`).

## GEO (assistants IA)

- Faits précis et vérifiables dans le HTML (adresse, horaires, services, organisation réelle des magasins).
- Phrases autonomes, compréhensibles hors contexte.
- `llms.txt` facultatif et non prioritaire.
- Mêmes coordonnées sur Google, Bing Places et Apple Business Connect (ChatGPT s'appuie sur Bing, Siri sur Apple).

## Mesure

- Lighthouse mobile via le MCP chrome-devtools : SEO, accessibilité et bonnes pratiques à 100, performance au moins 95.
- UTM sur le lien « site web » de chaque fiche Google : `?utm_source=google&utm_medium=organic&utm_campaign=gbp-<magasin>`.
