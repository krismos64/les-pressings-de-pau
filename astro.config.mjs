// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // Domaine provisoire : à confirmer après l'achat.
  site: "https://lespressingsdepau.fr",
  trailingSlash: "always",
  // Astro 7 utilise 'jsx' par défaut, qui peut supprimer les espaces entre éléments inline.
  compressHTML: true,
  // Polices téléchargées au build et servies depuis le site (aucun appel à Google côté visiteur).
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Contrail One",
      cssVariable: "--font-contrail-one",
      weights: [400],
      styles: ["normal"],
      fallbacks: ["sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "Open Sans",
      cssVariable: "--font-open-sans",
      weights: [400, 600, 700],
      styles: ["normal"],
      fallbacks: ["sans-serif"],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
