import { countTags, listPosts, type Post, postsWithTag } from "@/lib/posts";
import { MIN_INDEXED_TAG_POSTS, SITE_URL, tagSlug } from "@/lib/site";

const entry = (path: string, lastmod?: Date): string =>
  `  <url>\n    <loc>${SITE_URL}${path}</loc>${
    lastmod
      ? `\n    <lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>`
      : ""
  }\n  </url>`;

const latestUpdate = (posts: Post[]): Date =>
  new Date(Math.max(...posts.map((post) => post.updatedAt.getTime())));

export const GET = async (): Promise<Response> => {
  const posts = await listPosts();
  const urls =
    posts.length === 0
      ? []
      : [
          entry("/", latestUpdate(posts)),
          ...posts.map((post) => entry(`/blog/${post.slug}`, post.updatedAt)),
          entry("/tags", latestUpdate(posts)),
          ...[...countTags(posts)]
            .filter(([, count]) => count >= MIN_INDEXED_TAG_POSTS)
            .map(([tag]) =>
              entry(
                `/tags/${tagSlug(tag)}`,
                latestUpdate(postsWithTag(posts, tagSlug(tag))),
              ),
            ),
        ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
