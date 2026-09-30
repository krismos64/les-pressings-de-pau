import { getCollection, type CollectionEntry } from "astro:content";

import { JOURS, type Jour } from "./horaires.ts";

export type Magasin = CollectionEntry<"magasins">;

export async function magasinsTries(): Promise<Magasin[]> {
  return (await getCollection("magasins")).sort(
    (a, b) => a.data.ordre - b.data.ordre,
  );
}

export const urlMagasin = (m: Magasin): string => `/pressings/${m.id}/`;

export const adresseTexte = (m: Magasin): string =>
  `${m.data.adresse.rue}, ${m.data.adresse.codePostal} ${m.data.adresse.ville}`;

/** Lien Google Maps d'itinéraire vers l'adresse (aucun cookie tant qu'on ne clique pas). */
export function urlItineraire(m: Magasin): string {
  const destination = `${m.data.enseigne}, ${adresseTexte(m)}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

const JOUR_SCHEMA: Record<Jour, string> = {
  lundi: "Monday",
  mardi: "Tuesday",
  mercredi: "Wednesday",
  jeudi: "Thursday",
  vendredi: "Friday",
  samedi: "Saturday",
  dimanche: "Sunday",
};

/** JSON-LD DryCleaningOrLaundry. Horaires publiés seulement s'ils sont confirmés. */
export function jsonLdMagasin(m: Magasin, site: URL): Record<string, unknown> {
  const url = new URL(urlMagasin(m), site).href;
  const d = m.data;
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "DryCleaningOrLaundry",
    "@id": `${url}#magasin`,
    name: d.enseigne,
    url,
    telephone: d.telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: d.adresse.rue,
      postalCode: d.adresse.codePostal,
      addressLocality: d.adresse.ville,
      addressCountry: "FR",
    },
    parentOrganization: { "@id": new URL("/#reseau", site).href },
  };
  if (d.geo)
    ld["geo"] = {
      "@type": "GeoCoordinates",
      latitude: d.geo.lat,
      longitude: d.geo.lng,
    };
  if (d.googleMapsUrl) ld["hasMap"] = d.googleMapsUrl;
  if (d.horaires.statut === "confirme") {
    const { semaine } = d.horaires;
    ld["openingHoursSpecification"] = JOURS.flatMap((jour) =>
      semaine[jour].map((p) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: JOUR_SCHEMA[jour],
        opens: p.ouverture,
        closes: p.fermeture,
      })),
    );
  }
  return ld;
}
