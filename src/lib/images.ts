import type { ImageMetadata } from "astro";

import type { Magasin } from "./magasins.ts";

// Images générées par Codex, en attendant les vraies photos (cahier des charges §6).
// Toute image de ce dossier est signalée visuellement et par `npm run verif-publication`.
const provisoires = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/provisoire/*.{png,jpg,jpeg,webp}",
  { eager: true },
);

export interface Visuel {
  src: ImageMetadata;
  alt: string;
  provisoire: boolean;
}

type Repli = "facade" | "interieur";

const ALT_PROVISOIRE: Record<Repli, string> = {
  facade: "Image provisoire d'une façade de pressing",
  interieur: "Image provisoire d'un intérieur de pressing",
};

export function visuelProvisoire(repli: Repli): Visuel | undefined {
  const cle = Object.keys(provisoires).find((k) =>
    k.includes(`/${repli}-provisoire.`),
  );
  const src = cle ? provisoires[cle]?.default : undefined;
  return src
    ? { src, alt: ALT_PROVISOIRE[repli], provisoire: true }
    : undefined;
}

/** Photo réelle du magasin (index donné) ou, à défaut, image provisoire. */
export function photoMagasin(
  m: Magasin,
  index: number,
  repli: Repli,
): Visuel | undefined {
  const reelle = m.data.photos[index];
  return reelle
    ? { src: reelle.src, alt: reelle.alt, provisoire: false }
    : visuelProvisoire(repli);
}
