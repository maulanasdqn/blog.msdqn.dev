import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, sessionDrivers } from "astro/config";

export default defineConfig({
  site: "https://blog.msdqn.dev",
  output: "server",
  adapter: cloudflare({ imageService: "passthrough" }),
  session: { driver: sessionDrivers.lruCache() },
  trailingSlash: "never",
  redirects: {
    "/blog/ts-pattern-ts-belt-effect": {
      status: 301,
      destination: "/blog/typescript-without-surprises",
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
