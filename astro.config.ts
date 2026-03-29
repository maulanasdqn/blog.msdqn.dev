import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import remarkWikiLink from "remark-wiki-link";
import { readingTimePlugin } from "./src/lib/reading-time";
import { obsidianPlugin } from "./src/lib/obsidian";

export default defineConfig({
  site: "https://msdqn.dev",
  integrations: [sitemap()],
  vite: {
    build: {
      rollupOptions: {
        external: ["/pagefind/pagefind-ui.js"],
      },
    },
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: "rose-pine-dawn",
        dark: "rose-pine-moon",
      },
    },
    remarkPlugins: [
      [
        remarkWikiLink,
        {
          hrefTemplate: (permalink: string) => `/blog/${permalink}`,
          pageResolver: (name: string) => [name.toLowerCase().replace(/ /g, "-")],
          aliasDivider: "|",
        },
      ],
      readingTimePlugin,
      obsidianPlugin,
    ],
  },
});
