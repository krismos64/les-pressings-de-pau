import { defineCollection, reference } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

import {
  JOURS,
  erreursFermeture,
  erreursJour,
  estDate,
} from "./lib/horaires.ts";

const dateLocale = z
  .string()
  .refine(estDate, "Date attendue au format YYYY-MM-DD");

const plage = z.object({ ouverture: z.string(), fermeture: z.string() });

const semaine = z
  .object(
    Object.fromEntries(JOURS.map((j) => [j, z.array(plage)])) as Record<
      (typeof JOURS)[number],
      z.ZodArray<typeof plage>
    >,
  )
  .superRefine((s, ctx) => {
    for (const jour of JOURS) {
      for (const message of erreursJour(s[jour])) {
        ctx.addIssue({ code: "custom", path: [jour], message });
      }
    }
  });

// Deux états explicites : aucun horaire publiable tant que le client n'a pas confirmé.
const horaires = z.discriminatedUnion("statut", [
  z.object({ statut: z.literal("a-confirmer") }),
  z.object({ statut: z.literal("confirme"), semaine, verifieLe: dateLocale }),
]);

const fermeture = z
  .object({ du: dateLocale, au: dateLocale, motif: z.string().optional() })
  .superRefine((f, ctx) => {
    for (const message of erreursFermeture(f))
      ctx.addIssue({ code: "custom", message });
  });

const magasins = defineCollection({
  loader: glob({ base: "./src/content/magasins", pattern: "*.json" }),
  schema: ({ image }) =>
    z.object({
      ordre: z.number().int(),
      enseigne: z.string().min(1),
      repere: z.string().optional(),
      adresse: z.object({
        rue: z.string().min(1),
        codePostal: z.string().regex(/^\d{5}$/),
        ville: z.string().min(1),
      }),
      telephone: z
        .string()
        .regex(/^\+33[1-9]\d{8}$/, "Téléphone au format E.164 (+33...)"),
      geo: z.object({ lat: z.number(), lng: z.number() }).optional(),
      googleMapsUrl: z.url().optional(),
      horaires,
      fermetures: z.array(fermeture).default([]),
      services: z.array(reference("services")).default([]),
      societe: reference("societes").optional(),
      acces: z.string().optional(),
      photos: z
        .array(z.object({ src: image(), alt: z.string().min(1) }))
        .default([]),
    }),
});

const services = defineCollection({
  loader: glob({ base: "./src/content/services", pattern: "*.json" }),
  schema: z.object({
    ordre: z.number().int(),
    nom: z.string().min(1),
    description: z.string().min(1),
    publics: z.array(z.enum(["particuliers", "professionnels"])).min(1),
  }),
});

// Prix communs aux cinq magasins, en centimes TTC.
const tarifs = defineCollection({
  loader: file("src/content/tarifs.json"),
  schema: z
    .object({
      service: reference("services"),
      libelle: z.string().min(1),
      mode: z.enum(["fixe", "a-partir-de", "sur-devis"]),
      unite: z.enum(["piece", "m2", "kg"]).default("piece"),
      montantTTCCentimes: z.number().int().positive().optional(),
    })
    .refine(
      (t) => t.mode === "sur-devis" || t.montantTTCCentimes !== undefined,
      {
        message: "Montant obligatoire sauf pour un tarif sur devis",
      },
    ),
});

// Entités juridiques (mentions légales). Champs facultatifs tant que le dossier est incomplet.
const societes = defineCollection({
  loader: glob({ base: "./src/content/societes", pattern: "*.json" }),
  schema: z.object({
    raisonSociale: z.string().min(1),
    formeJuridique: z.string().optional(),
    siren: z
      .string()
      .regex(/^\d{9}$/)
      .optional(),
    rcs: z.string().optional(),
    siege: z.string().optional(),
    mediateur: z.object({ nom: z.string(), url: z.url() }).optional(),
  }),
});

const faq = defineCollection({
  loader: file("src/content/faq.json"),
  schema: z.object({
    question: z.string().min(1),
    reponse: z.string().min(1),
    magasin: reference("magasins").optional(),
  }),
});

// Le réseau est une marque commune, pas une société exploitante.
const reseau = defineCollection({
  loader: glob({ base: "./src/content/reseau", pattern: "*.json" }),
  schema: z.object({
    nom: z.string().min(1),
    signature: z.string().min(1),
    description: z.string().min(1),
  }),
});

export const collections = {
  magasins,
  services,
  tarifs,
  societes,
  faq,
  reseau,
};
