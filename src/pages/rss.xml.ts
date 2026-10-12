import rss from "@astrojs/rss";
import { renderMarkdown } from "@/lib/markdown";
import { listPosts } from "@/lib/posts";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const GET = async (): Promise<Response> => {
  const posts = await listPosts();
  const rendered = await Promise.all(
    posts.map((post) =>
      renderMarkdown(`${post.slug}:${post.updatedAt.getTime()}`, post.content),
    ),
  );
  return rss({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: SITE_URL,
    items: posts.map((post, index) => ({
      title: post.title,
      description: post.excerpt,
      content: rendered[index].html,
      pubDate: post.publishedAt,
      categories: post.tags,
      link: `/blog/${post.slug}`,
    })),
    customData: "<language>en</language>",
  });
};
