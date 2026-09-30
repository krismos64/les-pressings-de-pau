import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  erreursFermeture,
  erreursJour,
  etatOuverture,
  fermeturesActives,
  heureAffichage,
  instantParis,
  telephoneAffichage,
  type Semaine,
} from "./horaires.ts";

const ferme: never[] = [];
const semaine: Semaine = {
  lundi: [
    { ouverture: "09:00", fermeture: "12:30" },
    { ouverture: "14:30", fermeture: "18:00" },
  ],
  mardi: ferme,
  mercredi: ferme,
  jeudi: ferme,
  vendredi: ferme,
  samedi: ferme,
  dimanche: ferme,
};

// Lundi 5 octobre 2026, heure de Paris (UTC+2 en heure d'été).
const lundi = (heure: string): Date => new Date(`2026-10-05T${heure}:00+02:00`);

describe("etatOuverture", () => {
  it("ouvert pendant une plage", () => {
    assert.deepEqual(etatOuverture(semaine, [], lundi("10:00")), {
      ouvert: true,
      fermeA: "12:30",
    });
  });

  it("fermé pendant la pause déjeuner", () => {
    assert.equal(etatOuverture(semaine, [], lundi("13:00")).ouvert, false);
  });

  it("ouverture incluse, fermeture exclue", () => {
    assert.equal(etatOuverture(semaine, [], lundi("09:00")).ouvert, true);
    assert.equal(etatOuverture(semaine, [], lundi("12:30")).ouvert, false);
  });

  it("fermeture exceptionnelle prioritaire, fin incluse", () => {
    const fermetures = [{ du: "2026-10-01", au: "2026-10-05" }];
    assert.deepEqual(etatOuverture(semaine, fermetures, lundi("10:00")), {
      ouvert: false,
      raison: "fermeture-exceptionnelle",
    });
  });

  it("jour sans plage : fermé", () => {
    const mardi = new Date("2026-10-06T10:00:00+02:00");
    assert.deepEqual(etatOuverture(semaine, [], mardi), {
      ouvert: false,
      raison: "horaires",
    });
  });
});

describe("instantParis", () => {
  it("suit le passage à l'heure d'hiver (25 octobre 2026)", () => {
    // 08:30 UTC = 10:30 à Paris le samedi (UTC+2), 09:30 le lundi suivant (UTC+1).
    assert.equal(
      instantParis(new Date("2026-10-24T08:30:00Z")).minutes,
      10 * 60 + 30,
    );
    assert.equal(
      instantParis(new Date("2026-10-26T08:30:00Z")).minutes,
      9 * 60 + 30,
    );
  });

  it("date locale et non UTC autour de minuit", () => {
    const i = instantParis(new Date("2026-10-04T22:30:00Z"));
    assert.equal(i.date, "2026-10-05");
    assert.equal(i.jour, "lundi");
  });
});

describe("validations", () => {
  it("refuse une ouverture après la fermeture et les chevauchements", () => {
    assert.equal(
      erreursJour([{ ouverture: "18:00", fermeture: "09:00" }]).length,
      1,
    );
    assert.equal(
      erreursJour([
        { ouverture: "09:00", fermeture: "13:00" },
        { ouverture: "12:00", fermeture: "18:00" },
      ]).length,
      1,
    );
    assert.deepEqual(erreursJour(semaine.lundi), []);
  });

  it("refuse une heure ou une date invalide", () => {
    assert.equal(
      erreursJour([{ ouverture: "9h", fermeture: "12:00" }]).length,
      1,
    );
    assert.equal(
      erreursFermeture({ du: "2026-02-30", au: "2026-03-01" }).length,
      1,
    );
    assert.equal(
      erreursFermeture({ du: "2026-03-02", au: "2026-03-01" }).length,
      1,
    );
  });

  it("écarte les fermetures passées", () => {
    const f = [
      { du: "2026-08-24", au: "2026-08-30" },
      { du: "2026-12-24", au: "2026-12-26" },
    ];
    assert.deepEqual(fermeturesActives(f, "2026-10-05"), [f[1]]);
  });
});

it("formate un numéro E.164", () => {
  assert.equal(telephoneAffichage("+33559309275"), "05 59 30 92 75");
});

it("formate une heure à la française", () => {
  assert.equal(heureAffichage("09:00"), "9h");
  assert.equal(heureAffichage("12:30"), "12h30");
  assert.equal(heureAffichage("18:00"), "18h");
});
