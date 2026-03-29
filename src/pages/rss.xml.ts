import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getAllPosts } from "../lib/posts";

export async function GET(context: APIContext) {
  const posts = await getAllPosts();
  return rss({
    title: "msdqn.dev",
    description: "Personal blog about software engineering and technology.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}`,
    })),
  });
}
