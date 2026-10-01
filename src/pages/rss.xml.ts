import rss from "@astrojs/rss";
import { listPosts } from "@/lib/posts";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const GET = async (): Promise<Response> => {
  const posts = await listPosts();
  return rss({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: SITE_URL,
    items: posts.map((post) => ({
      title: post.title,
      description: post.excerpt,
      pubDate: post.publishedAt,
      categories: post.tags,
      link: `/blog/${post.slug}`,
    })),
    customData: "<language>en</language>",
  });
};
