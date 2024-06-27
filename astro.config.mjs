import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import tailwind from "@astrojs/tailwind";
import pagefind from "astro-pagefind";

// https://astro.build/config
export default defineConfig({
  site: "https://etherpedia.2077.xyz",
  integrations: [mdx(), sitemap(), tailwind(), pagefind()],
});
