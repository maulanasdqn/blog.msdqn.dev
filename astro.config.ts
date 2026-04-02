import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import remarkWikiLink from "remark-wiki-link";
import { obsidianPlugin, rehypeHighlight } from "./src/lib/obsidian";
import { readingTimePlugin } from "./src/lib/reading-time";

export default defineConfig({
  site: "https://msdqn.dev",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
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
          pageResolver: (name: string) => [
            name.toLowerCase().replace(/ /g, "-"),
          ],
          aliasDivider: "|",
        },
      ],
      readingTimePlugin,
      obsidianPlugin,
    ],
    rehypePlugins: [rehypeHighlight],
  },
});
