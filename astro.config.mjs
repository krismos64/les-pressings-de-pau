// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // Domaine provisoire : à confirmer après l'achat.
  site: "https://lespressingsdepau.fr",
  trailingSlash: "always",
  // Astro 7 utilise 'jsx' par défaut, qui peut supprimer les espaces entre éléments inline.
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
