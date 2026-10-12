# blog.msdqn.dev

Maulana Sodiqin's blog. Astro 6, server-rendered on Cloudflare Workers, monochrome design shared with [msdqn.dev](https://msdqn.dev).

## Content

Posts are written in the msdqn.dev CMS (`/cms/blog`) and stored in the shared D1 database `msdqn-dev` (`blog_posts` table). The blog reads them at request time through the `DB` binding, so publishing a post in the CMS makes it live immediately; no rebuild is needed.

Post bodies are Markdown with GFM tables and task lists, Obsidian callouts (`> [!note]`), wiki links (`[[Post title]]`), `==highlights==`, and syntax-highlighted code blocks. Only posts with `published = 1` are shown.

## Routes

| Path | |
| --- | --- |
| `/` | All posts |
| `/blog/:slug` | Post (table of contents, related posts) |
| `/tags`, `/tags/:tag` | Topics |
| `/search?q=` | Full-text search over title, excerpt, content and tags |
| `/rss.xml` | RSS feed, also read by msdqn.dev |
| `/sitemap.xml` | Sitemap |
| `/og/:slug.png` | Generated 1200×630 social and cover image per post (Satori + resvg, cached by `updated_at`) |
| `/blog/:slug.md` | Post as plain Markdown, for LLMs and AI crawlers |
| `/llms.txt`, `/llms-full.txt` | Post index and full text for language models ([llmstxt.org](https://llmstxt.org)) |

## Commands

| Command | |
| --- | --- |
| `npm run dev` | Dev server; the `DB` binding uses the remote production database (read-only queries) |
| `npm run check` | Biome and `astro check` |
| `npm run deploy` | Build and deploy to `blog.msdqn.dev` with Wrangler |
| `npm run types` | Regenerate `worker-configuration.d.ts` after changing `wrangler.jsonc` |

`vite` is pinned to 7.x through `overrides` because mixing Vite 7 and 8 breaks the Cloudflare adapter (`require_dist is not a function`).
