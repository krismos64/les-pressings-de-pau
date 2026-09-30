// Liste ce qui reste à valider avant la mise en ligne.
// Usage : npm run verif-publication (code de sortie 1 s'il reste des points).

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const racine = new URL("..", import.meta.url).pathname;
const points: string[] = [];

const dossierMagasins = join(racine, "src/content/magasins");
for (const fichier of readdirSync(dossierMagasins).filter((f) =>
  f.endsWith(".json"),
)) {
  const m = JSON.parse(readFileSync(join(dossierMagasins, fichier), "utf8"));
  const nom = `${m.enseigne} (${fichier})`;
  if (m.horaires?.statut !== "confirme")
    points.push(`${nom} : horaires à confirmer`);
  if (!m.societe) points.push(`${nom} : société exploitante non renseignée`);
  if (!m.geo) points.push(`${nom} : coordonnées GPS manquantes`);
  if (!m.googleMapsUrl) points.push(`${nom} : lien Google Maps manquant`);
  if (!m.photos?.length) points.push(`${nom} : aucune photo`);
  if (!m.services?.length) points.push(`${nom} : aucun service associé`);
}

const compter = (dossier: string): number =>
  readdirSync(join(racine, dossier)).filter((f) => f.endsWith(".json")).length;
if (compter("src/content/services") === 0) points.push("Aucun service défini");
if (compter("src/content/societes") === 0)
  points.push("Aucune société (mentions légales)");

// Marqueurs « À CONFIRMER » laissés dans le code ou les contenus.
const parcourir = (dossier: string): string[] =>
  readdirSync(dossier, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? parcourir(join(dossier, e.name))
      : [join(dossier, e.name)],
  );
for (const f of parcourir(join(racine, "src")).filter((f) =>
  /\.(astro|ts|json|md)$/.test(f),
)) {
  if (f.endsWith("verif-publication.ts")) continue;
  if (readFileSync(f, "utf8").includes("À CONFIRMER")) {
    points.push(`Marqueur « À CONFIRMER » dans ${f.replace(racine, "")}`);
  }
}

if (points.length === 0) {
  console.log("Prêt pour la mise en ligne : aucun point en attente.");
} else {
  console.log(`${points.length} point(s) à valider avant la mise en ligne :\n`);
  for (const p of points) console.log(`- ${p}`);
  process.exitCode = 1;
}
