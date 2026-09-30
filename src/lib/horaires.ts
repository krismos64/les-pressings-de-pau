// Fonctions pures sur les horaires, partagées entre le build (pages, JSON-LD)
// et le navigateur (badge « ouvert maintenant »). Aucun import Astro ici.

export const JOURS = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
] as const;

export type Jour = (typeof JOURS)[number];

/** Plage d'ouverture, heures locales de Paris au format "HH:MM". */
export interface Plage {
  ouverture: string;
  fermeture: string;
}

/** Une liste vide signifie « fermé ce jour-là », jamais « inconnu ». */
export type Semaine = Record<Jour, Plage[]>;

/** Fermeture exceptionnelle, dates locales "YYYY-MM-DD", fin incluse. */
export interface Fermeture {
  du: string;
  au: string;
  motif?: string | undefined;
}

const HEURE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export function estHeure(valeur: string): boolean {
  return HEURE.test(valeur);
}

export function estDate(valeur: string): boolean {
  if (!DATE.test(valeur)) return false;
  const d = new Date(`${valeur}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(valeur);
}

export function enMinutes(heure: string): number {
  const [h, m] = heure.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/** Erreurs d'une journée : format, ouverture avant fermeture, ordre, chevauchement. */
export function erreursJour(plages: Plage[]): string[] {
  const erreurs: string[] = [];
  plages.forEach((p, i) => {
    if (!estHeure(p.ouverture) || !estHeure(p.fermeture)) {
      erreurs.push(
        `plage ${i + 1} : heure invalide (${p.ouverture}-${p.fermeture})`,
      );
      return;
    }
    if (enMinutes(p.ouverture) >= enMinutes(p.fermeture)) {
      erreurs.push(`plage ${i + 1} : l'ouverture doit précéder la fermeture`);
    }
    const precedente = plages[i - 1];
    if (
      precedente &&
      enMinutes(p.ouverture) < enMinutes(precedente.fermeture)
    ) {
      erreurs.push(`plage ${i + 1} : chevauche ou précède la plage ${i}`);
    }
  });
  return erreurs;
}

/** Erreurs d'une fermeture exceptionnelle. */
export function erreursFermeture(f: Fermeture): string[] {
  if (!estDate(f.du) || !estDate(f.au))
    return [`dates invalides (${f.du} au ${f.au})`];
  return f.du <= f.au
    ? []
    : [`la date de début (${f.du}) suit la date de fin (${f.au})`];
}

export interface InstantParis {
  date: string; // "YYYY-MM-DD"
  jour: Jour;
  minutes: number;
}

/** Date, jour et minute locales à Paris (changements d'heure compris). */
export function instantParis(maintenant: Date): InstantParis {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "long",
    hourCycle: "h23",
  }).formatToParts(maintenant);
  const val = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((p) => p.type === type)?.value ?? "";
  return {
    date: `${val("year")}-${val("month")}-${val("day")}`,
    jour: val("weekday") as Jour,
    minutes: Number(val("hour")) * 60 + Number(val("minute")),
  };
}

export function fermetureEnCours(
  fermetures: Fermeture[],
  date: string,
): Fermeture | undefined {
  return fermetures.find((f) => f.du <= date && date <= f.au);
}

/** Fermetures en cours ou à venir (les passées sont écartées). */
export function fermeturesActives(
  fermetures: Fermeture[],
  date: string,
): Fermeture[] {
  return fermetures
    .filter((f) => f.au >= date)
    .sort((a, b) => a.du.localeCompare(b.du));
}

export type EtatOuverture =
  | { ouvert: true; fermeA: string }
  | { ouvert: false; raison: "horaires" | "fermeture-exceptionnelle" };

export function etatOuverture(
  semaine: Semaine,
  fermetures: Fermeture[],
  maintenant: Date,
): EtatOuverture {
  const { date, jour, minutes } = instantParis(maintenant);
  if (fermetureEnCours(fermetures, date)) {
    return { ouvert: false, raison: "fermeture-exceptionnelle" };
  }
  const plage = semaine[jour].find(
    (p) =>
      enMinutes(p.ouverture) <= minutes && minutes < enMinutes(p.fermeture),
  );
  return plage
    ? { ouvert: true, fermeA: plage.fermeture }
    : { ouvert: false, raison: "horaires" };
}

/** "09:00" devient "9h", "12:30" devient "12h30". */
export function heureAffichage(heure: string): string {
  const [h = "0", m = "00"] = heure.split(":");
  return `${Number(h)}h${m === "00" ? "" : m}`;
}

/** "+33559309275" devient "05 59 30 92 75". */
export function telephoneAffichage(e164: string): string {
  const national = `0${e164.replace(/^\+33/, "")}`;
  return national.replace(/(\d{2})(?=\d)/g, "$1 ");
}
