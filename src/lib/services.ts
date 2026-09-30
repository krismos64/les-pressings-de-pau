import { getCollection, getEntries, type CollectionEntry } from "astro:content";

export type Service = CollectionEntry<"services">;

export async function servicesTries(): Promise<Service[]> {
  return (await getCollection("services")).sort(
    (a, b) => a.data.ordre - b.data.ordre,
  );
}

/** Prix le plus bas parmi les lignes de tarif du service (en centimes). */
export async function prixMinimum(service: Service): Promise<{
  centimes: number;
  unite: "piece" | "m2";
}> {
  const lignes = await getEntries(service.data.tarifs);
  const min = lignes.reduce((a, b) =>
    b.data.montantTTCCentimes < a.data.montantTTCCentimes ? b : a,
  );
  return { centimes: min.data.montantTTCCentimes, unite: min.data.unite };
}

export const prixEuros = (centimes: number): string =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    centimes / 100,
  );
