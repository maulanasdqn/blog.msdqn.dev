import { countTags, listPosts } from "@/lib/posts";
import { SITE_URL, tagSlug } from "@/lib/site";

const entry = (path: string, lastmod?: Date): string =>
  `  <url>\n    <loc>${SITE_URL}${path}</loc>${
    lastmod
      ? `\n    <lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>`
      : ""
  }\n  </url>`;

export const GET = async (): Promise<Response> => {
  const posts = await listPosts();
  const urls =
    posts.length === 0
      ? []
      : [
          entry("/", posts[0].updatedAt),
          ...posts.map((post) => entry(`/blog/${post.slug}`, post.updatedAt)),
          entry("/tags"),
          ...[...countTags(posts).keys()].map((tag) =>
            entry(`/tags/${tagSlug(tag)}`),
          ),
        ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
